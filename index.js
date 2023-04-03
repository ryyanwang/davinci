const express = require("express");
const app = express();
const serviceURL = "http://localhost:8123/api/services/";
require("dotenv").config();

const TOKEN = process.env.HA_API_KEY;
console.log(TOKEN);
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
