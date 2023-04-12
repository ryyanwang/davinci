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

app.get(`/test`, (req, res) => {
  data = req.body;
  if (data == []) {
    res.send(`poop`);
  } else {
    res.send(`pee`);
  }
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

  let url = homesAssistantAPIURL + "states";

  switch (queryData.target) {
    case "thsensor": {
      console.log(`poop`);
      fetch(url + `/sensor.${location}${property}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            return response.json();
          } else {
            res.send("Temperature humidity sensor not found.");
            return;
          }
        })
        .then((data) => {
          var value = data.state;
          console.log(value);
          if (property == "humidity") {
            res.send(
              `The relative humidity in the ${location} is currently ${value}%.`
            );
            return;
          } else {
            res.send(
              `The temperature in the ${location} is currently ${value} degrees Celsius.`
            );
            return;
          }
        })
        .catch((error) => {});
      break;
    }

    case "doorsensor": {
      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            res.send(`Error getting information from door sensor`);
            return;
          }
        })
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
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            res.send(`Error getting information from water sensor`);
            return;
          }
        })
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
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            res.send(`Error getting information from motion sensor`);
            return;
          }
        })
        .then((data) => {
          res.send(
            data.state == "off"
              ? `No motion detected in the ${location}.`
              : `Motion detected in the ${location}.`
          );
        });
      break;
    }
    default:
      res.send(`Couldn't find  your device`);
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
  let delay = commandData.delay * 1000; // Convert from seconds to milliseconds
  let location = commandData.location;

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
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                res.send(`Couldn't find your smart plug. Please try again.`);
                return;
              }
            })
            .then((data) => {
              res.send("ok");
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
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                res.send(`Couldn't find your smart plug. Please try again.`);
                return;
              }
            })
            .then((data) => {
              res.send("ok");
            });
        }, delay);
      }
      break;
    // // if light
    case "switch":
      if (commandData.value == "on") {
        setTimeout(() => {
          fetch(url + "/switch/turn_on", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              entity_id: `switch.${location}lightswitch`,
            }),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                res.send(`Couldn't find your light switch. Please try again`);
                return;
              }
            })
            .then((data) => {
              res.send("ok");
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
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                res.send(`Couldn't find your light switch. Please try again.`);
                return;
              }
            })
            .then((data) => {
              res.send("ok");
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
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                res.send(`We couldn't find your covers. Please try again.`);
                return;
              }
            })
            .then((data) => {
              res.send("ok");
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
            .then((response) => {
              console.log(response);
              if (response.ok) {
                return response.json();
              } else {
                res.send(`We couldn't find your covers. Please try again`);
                return;
              }
            })
            .then((data) => {
              if (Array.isArray(data) && data.length === 0) {
                res.send(`We couldn't find your covers. Please try again`);
              } else {
                res.send("ok");
              }
              console.log(data);
            });
        }, delay);
      }
      break;

    // if routine
    case "routine":
      setTimeout(() => {
        fetch(url + `/automation/trigger`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            entity_id: `automation.${commandData.value}`,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              res.send(
                `There was an error initalizing your routine. Please try again`
              );
              return;
            }
          })
          .then((data) => {
            res.send("ok");
          });
      }, delay);
      break;
    default: {
      res.send("We couldn't find your device. Please try again.");
    }
  }
});
