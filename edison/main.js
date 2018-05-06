var hx711 = require("jsupm_hx711"); // Instantiate a HX711 data on digital pin D3 and clock on digital pin D2
var jsUpmI2cLcd  = require ('jsupm_i2clcd');
var outliers = require('outliers');
var http = require('http');

var CALIBRATION_FACTOR = -7050;

var READINGS_PER_SECOND = 2;
var POST_REQUEST_THRESHOLD = 1;
// var GARBAGE_HOST = "c0554f05.ngrok.io"; // abhishek
var GARBAGE_HOST = "58da7600.ngrok.io"; // mario

// Arduino mapping
var DATA_SHIELD = 3; // Arduino shield
var CLOCK_SHIELD = 2; // Arduino shield
var scale = new hx711.HX711(DATA_SHIELD, CLOCK_SHIELD);
var lcd = new jsUpmI2cLcd.Jhd1313m1(6, 0x3E, 0x62);
lcd.clear();
lcd.setCursor(0, 1);
writeToScreen('Calibrating...');

var TEST_MODE = false;

// Set to true when Ctrl-C entered
var exitProcessRequested = false;

// Keyboard input setup
var keypress = require("keypress");
var tty = require("tty");

var rc = setupKeyboard();
if (!rc) {
  return;
}

setupHX711();

var offset;

function setupKeyboard() {
  // make `process.stdin` begin emitting "keypress" events
  keypress(process.stdin);

  // listen for the "keypress" event
  process.stdin.on("keypress", function(ch, key) {
    if (key && key.ctrl && key.name == "c") {
      process.stdin.pause();
      exitProcessRequested = true;
    } else if (ch == "+" || ch == "a") {
      offset += 1;
    } else if (ch == "-" || ch == "z") {
      offset -= 1;
    }
  });

  if (typeof process.stdin.setRawMode == "function") {
    process.stdin.setRawMode(true);
  } else {
    try {
      tty.setRawMode(true);
    } catch (ex) {
      console.log("This script must be run from command line, not xdk-daemon!");
      return false;
    }
  }
  process.stdin.resume();
  return true;
}


function setupHX711() {
  //   scale.setScale(CALIBRATION_FACTOR);

  setTimeout(function() {
    var values = [];

    for (i = 0; i < 10; ++i) {
      var reading = scale.getValue();
      console.log(reading);
      values.push(reading);
    }

    values = values.filter(outliers());

    var offset = values.reduce(function(acc, value) {
        return acc + value;
    }, 0) / values.length;

    periodicActivity(offset);
  }, 2000);
}

var valuesHistory = [];
var devices = [1, 2, 3, 4, 5, 6];

function randomDevice() {
  try {
    return devices[Math.floor(Math.random() * devices.length)];
  } catch(e) {
    console.log('using first user because you dumb', e);
    return devices[0];
  }
}

function postGarbage(weight, cb) {
  var postData = JSON.stringify({
    lbs: weight,
    deviceID: randomDevice(),
  });

  log('postGarbage', postData);

  var options = {
    hostname: GARBAGE_HOST,
    port: 80,
    path: '/garbage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
      var isSuccess = res.statusCode == 200 || (res.statusCode == 405 && TEST_MODE);

      if (!isSuccess) {
        return cb(new Error("status code not 200"));
      }

      cb();
    });
  });

  req.on('error', (e) => {
    cb(e);
  });

  req.write(postData);
  req.end();
}

function average(arr) {
    return arr.reduce(function(acc, value) {
        return acc + value;
    }, 0) / arr.length;
}

function writeToScreen(text) {
  lcd.clear();
  lcd.write(text);
}

function cleanUp() {
  lcd.clear();
}

function scheduleNextReading(offset) {
  if (!exitProcessRequested) {
    setTimeout(function() {
        periodicActivity(offset);
    }, 1000 / READINGS_PER_SECOND);
  } else {
    console.log("All done!");
    cleanUp();
  }
}

var hasCrossedPostRequestThreshold = false;

function log() {
  if (TEST_MODE) {
    console.log.apply(console, Array.from(arguments));
  }
}

function periodicActivity(offset) {
  var value = (scale.getValue(1) - offset) / CALIBRATION_FACTOR;
  value = Number(parseFloat(Math.abs(value).toString()).toFixed(2));

  console.log("Reading: " + value + " lbs");

  writeToScreen(`${value.toString()} lbs`);

  valuesHistory.push(value);

  if (valuesHistory.length >= READINGS_PER_SECOND * 10) {
    log('clipping history');
    valuesHistory.shift();
  } else {
    log('not enough data', valuesHistory.length);
    scheduleNextReading(offset);
    return;
  }

  log('valuesHistory', valuesHistory);

  if (!hasCrossedPostRequestThreshold) {
    var thresholdInquiryValues = valuesHistory.filter(outliers());
    var thresholdInquiry = average(thresholdInquiryValues) || 0;

    if (thresholdInquiry >= POST_REQUEST_THRESHOLD) {
        hasCrossedPostRequestThreshold = true;
        log('Crossed post request threshold, value: ', thresholdInquiry);
    } else {
      log('thresholdInquiryValues', thresholdInquiryValues);
      log('Threshold not crossed, value', thresholdInquiry);
      scheduleNextReading(offset);
      return;
    }
  }

  var sensicalHistory = valuesHistory.slice(10).filter(outliers());

  log('sensicalHistory', sensicalHistory);

  if (average(sensicalHistory) < POST_REQUEST_THRESHOLD && sensicalHistory.length >= 5) {
      var finalValue = average(valuesHistory.slice(0,10).filter(outliers()));

      try {
        postGarbage(finalValue, function(e) {
          if (e) {
            console.error('error posting garbage (callback)', e);
          }
        });
      } catch (e) {
        console.error('error posting garbage (try-catch)', e);
      }

      valuesHistory = [];

      scheduleNextReading(offset);
      hasCrossedPostRequestThreshold = false;
      return;
  }

  log('sensicalHistory does not cross post request threshold, sensicalHistory average', average(sensicalHistory))

  scheduleNextReading(offset);
}
