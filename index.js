const express = require("express");
const app = express();
const serviceURL = "http://localhost:8123/api/services/";
require("dotenv").config();

const TOKEN = process.env.HA_API_KEY;
// CONST URL = TODO
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

app.use(express.json());

app.listen(8080, () => {
  console.log("listening on port 8080");
});

app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/command", (req, res) => {
  var commandData = req.body;

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

// Query JSON data
// {
//   "action": "query",
//   "location": "living room",
//   "target": "thermostat",
//   "property": "temperature",
//   "comment": "The temperature in the living room is currently 23°C."
// }
app.get("/query", (req, res) => {
  var queryData = req.body;
  //
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
