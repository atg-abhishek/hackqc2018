var hx711 = require("jsupm_hx711"); // Instantiate a HX711 data on digital pin D3 and clock on digital pin D2
var outliers = require('outliers');

// Arduino mapping
var DATA_SHIELD = 3; // Arduino shield
var CLOCK_SHIELD = 2; // Arduino shield

// MRAA mapping
var DATA_MRAA = 20; // GPIO block GP12
var CLOCK_MRAA = 13; // GPIO block GP128

var scale = new hx711.HX711(DATA_SHIELD, CLOCK_SHIELD);

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

var CALIBRATION_FACTOR = -7050;

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

    // offset = 7971400;

    // offset = Math.round(offset * 100) / 100

    console.log("offset", offset);
    periodicActivity(offset);
  }, 2000);
}

var READINGS_PER_SECOND = 2;
var valuesHistory = [];
var devices = [1, 2, 3, 4];

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
    deviceId: randomDevice(),
  });

  var options = {
    hostname: 'http://c0554f05.ngrok.io/',
    port: 80,
    path: '/garbage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = http.request(options, (res) => {
    if (res.statusCode != 200) {
      cb(new Error("status code not 200"));
    }

    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
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

setTimeout(function() {
    periodicActivity(offset);
}, 1000 / READINGS_PER_SECOND);

var POST_REQUEST_THRESHOLD = 1;
var hasCrossedPostRequestThreshold = false;

function periodicActivity(offset) {
  var value = (scale.getValue(1) - offset) / CALIBRATION_FACTOR;
  value = parseFloat(Math.abs(value).toString()).toFixed(2);

  console.log("Reading: " + value + " lbs");

  valuesHistory.push(value);

  if (valuesHistory.length >= READINGS_PER_SECOND * 10) {
    valuesHistory.unshift();
  } else {
      scheduleNextReading(offset);
      return;
  }

  if (!hasCrossedPostRequestThreshold) {
      if (average(valuesHistory.filter(outliers())) >= POST_REQUEST_THRESHOLD) {
          hasCrossedPostRequestThreshold = true;
      } else {
        scheduleNextReading(offset);
        return;
      }
  }

  var sensicalHistory = valuesHistory.slice(10).filter(outliers());

  if (average(sensicalHistory) < POST_REQUEST_THRESHOLD && sensicalHistory.length >= 5) {
      var finalValue = average(sensicalHistory.slice(0,10).filter(outliers()));

      postGarbage(finalValue, function(e) {
        if (e) {
          console.log('error posting garbage', e);
        }

        scheduleNextReading(offset);
      });

      hasCrossedPostRequestThreshold = false;
      return;
  }

  if (!exitProcessRequested) {
    scheduleNextReading(offset);
  } else {
    console.log("All done!");
  }
}
