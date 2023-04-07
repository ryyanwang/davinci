const express = require("express");
const app = express();
require("dotenv").config();

const homesAssistantAPIURL =
  //process.env.HOME_ASSISTANT_API_URL;

  "http://localhost:8123/api/";
const haToken =
  //process.env.HA_API_KEY;
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1NmQzOTkzNjY0MTc0NThhOTMzMTgxNWEzZjFiNGUwNCIsImlhdCI6MTY4MDE2Mjc5MSwiZXhwIjoxOTk1NTIyNzkxfQ.8LfUN-Y1sbfMGCPbcyLKDkzlVi_oEblqTnqlUcMAWG0";

// CONST URL = TODO

const headers = {
  Authorization: `Bearer ${haToken}`,
  "Content-Type": "application/json",
};

app.use(express.json());

app.listen(8080, () => {
  console.log("listening on port 8080");
});

app.get("/testCommandOff", (req, res) => {
  var commandData = req.body;

  fetch("http://localhost:8123/api/services/switch/turn_off", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      entity_id: "switch.office",
    }),
  });
  // .then((response) => response.text())
  // .then((data) => console.log(data))
  // .catch((error) => console.error(error));
});

app.get("/test", (req, res) => {
  res.send("hi");
});

// Query JSON data
// {
//   "action": "query",
//   "location": "living room",
//   "target": "thermostat",
//   "property": "temperature",
// }

app.post("/query", (req, res) => {
  var queryData = req.body;
  var location = queryData.location;
  var property = queryData.property;
  let url = homesAssistantAPIURL + "states/";
  switch (queryData.target) {
    case "thsensor":
      url = url + `/sensor.${location}${property}`;
      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          var value = data.state;
          if (property == "humidity") {
            res.send(
              `The relative humidity in the ${location} is currently ${value}%.`
            );
          } else {
            res.send(
              `The temperature in the ${location} is currently ${value} degrees Celsius.`
            );
          }
        })
        .catch((error) => console.error(error));

    // TODO: NEED TO ADD PROPERTY
    case "doorsensor":
      url = url + `/binary_sensor.${location}${property}`;

      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.state);
          res.send(
            `The ${location} door is ${data.state == "on" ? "open" : "closed"}.`
          );
        });

    case "watersensor":
      url = url + `binary_sensor.${location}${property}`;
      console.log(url);
      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          res.send(
            data.state == "off"
              ? `No water detected in the ${location}.`
              : `Water detected in the ${location}.`
          );
        });
    case "motionsensor":
      url = url + `binary_sensor.${location}${property}`;
      console.log(url);
      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          res.send(
            data.state == "off"
              ? `No motion detected in the ${location}.`
              : `Motion detected in the ${location}.`
          );
        });
  }
});

// Command JSON data
// {
//   "action": "command",
//   "location": "living room",
//   "target": "fan",
//   "value": "off",
//   "comment": "The fan in the living room has been turned off.",
//   "scheduleTimeStamp": null
// }
app.post("/command", (req, res) => {
  var commandData = req.body;

  // configure delay
  let delay = commandData.delay * 1000;

  switch (commandData.target) {
  }
  // if smartplug

  // if smartlight

  // if routine

  // if blinds

  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});

app.get("/testCommandOn", (req, res) => {
  var commandData = req.body;

  fetch("http://localhost:8123/api/services/switch/turn_on", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      entity_id: "switch.office",
    }),
  });
  // .then((response) => response.text())
  // .then((data) => console.log(data))
  // .catch((error) => console.error(error));
});
