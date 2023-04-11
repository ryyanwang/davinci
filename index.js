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

// Query JSON data
// {
//   "action": "query",
//   "location": "living room",
//   "target": "thermostat",
//   "property": "temperature",
// }

app.post("/query", (req, res) => {
  let queryData = req.body;
  let location = queryData.location;
  let property = queryData.property;
  let target = queryData.target;

  var url = homesAssistantAPIURL + "states";

  switch (queryData.target) {
    case "thsensor": {
      `/sensor.${location}${property}`;
      fetch(url + `/sensor.${location}${property}`, {
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
      break;
    }

    // TODO: NEED TO ADD PROPERTY
    case "doorsensor": {
      console.log(`${location}`);
      console.log(`${property}`);
      console.log(`${target}`);
      console.log(url + `/binary_sensor.${location}${target}`);
      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          res.send(
            `The ${location} door is ${data.state == "on" ? "open" : "closed"}.`
          );
        });
      break;
    }

    case "watersensor": {
      fetch(url + `/binary_sensor.${location}${property}`, {
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
      break;
    }

    case "motionsensor": {
      fetch(url + `/binary_sensor.${location}${property}`, {
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
      break;
    }
  }
});

// Command JSON data
// {
//   "action": "command",
//   "location": "office",
//   "target": "plug",
//   "value": "off",
//   "comment": "I'm setting up the departure routine for you. All lights will be turned off and the blinds will be closed in 5 minutes.",
//   "delay": 3}
app.post("/command", (req, res) => {
  var commandData = req.body;

  let url = homesAssistantAPIURL + "services";
  // configure delay
  let delay = commandData.delay * 1000;
  let location = commandData.location;
  let target = commandData.target;

  switch (commandData.target) {
    //if plug
    case "plug":
      if (commandData.value == "on") {
        setTimeout(() => {
          fetch(url + "/switch/turn_on", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `switch.${location}plug`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      } else {
        setTimeout(() => {
          fetch(url + "/switch/turn_off", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `switch.${location}plug`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      }
      break;
    // // if light
    case "switch":
      console.log("poop");
      if (commandData.value == "on") {
        console.log("poop1");
        setTimeout(() => {
          fetch(url + "/switch/turn_on", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `switch.${location}lightswitch`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      } else {
        setTimeout(() => {
          fetch(url + "/switch/turn_off", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `switch.${location}lightswitch`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      }
      break;

    // if blinds
    case "blinds":
      if (commandData.value == "uncover") {
        setTimeout(() => {
          fetch(url + "/cover/open_cover", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `cover.${location}blinds`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      } else {
        setTimeout(() => {
          fetch(url + "/cover/close_cover", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `cover.${location}blinds`,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              res.send("yeet");
            });
        }, delay);
      }
      break;

    // if routine
    case "routine":
      console.log("reached routine");
      console.log(url + `/automation/trigger/`);
      setTimeout(() => {
        fetch(url + `/automation/trigger`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            entity_id: `automation.${commandData.value}`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            res.send("yeet");
          });
      }, delay);
      break;
  }
});
