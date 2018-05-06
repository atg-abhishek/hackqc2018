import axios from "axios";

export const devicesMap = {
  1: "Salon",
  2: "Cuisine",
  3: "Toilette",
  4: "Cuisine",
  5: "Cuisine",
  6: "Cuisine"
};

export const usersMap = {
  1: "Abhishek Gupta",
  2: "Mario Lamontagne",
  3: "François-Xavier Lemire",
  4: "Norma-Yan Mercier"
};

export function fetch(url) {
  const res = {
    1: [
      { lbs: 2, deviceID: 1 },
      { lbs: 5, deviceID: 1 },
      { lbs: 4, deviceID: 1 },
      { lbs: 5, deviceID: 1 },
      { lbs: 6, deviceID: 1 }
    ],
    2: [{ lbs: 23, deviceID: 4 }],
    3: [{ lbs: 13, deviceID: 5 }],
    4: [{ lbs: 30, deviceID: 6 }]
  };

  return axios
    .request({ method: "get", url: "/garbage", responseType: "json", baseURL: "http://b2f6afdd.ngrok.io/" })
    .then(res => mapToFormat(res.data.result));

  // return Promise.resolve(mapToFormat(res));
}

function mapToFormat(serverData = {}) {
  return Object.keys(serverData).reduce((acc, userId) => {
    acc[userId] = {
      name: usersMap[userId],
      entries: (serverData[userId] || []).map(e => {
        return {
          ...e,
          date: e.date ? new Date(e.date) : new Date(),
          deviceLabel: devicesMap[e.deviceID]
        };
      })
    };

    return acc;
  }, {});
}
