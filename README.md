# When Chat-GPT meets Third Reality

## Introduction
Here in the Third Reality Lab, we were inspired by Mate Marschalko's demo using OpenAI models to create a more sophisticated and JARVIS-esque home assistant. I highly suggest you go ahead and read (or at least gloss over) his [blogpost](https://matemarschalko.medium.com/chatgpt-in-an-ios-shortcut-worlds-smartest-homekit-voice-assistant-9a33b780007a).  as provides a good base understanding of the logic flow of the program. You can also watch his [demo](https://www.youtube.com/watch?v=THeet9bbphw&ab_channel=MateMarschalko).

We tried to integrate this idea into the Home Assistant and Third Reality Ecosystem. The difficulty lies in the fact that Third Reality has no integrations with Apple's Homekit ecosystem. In other words, you cannot directly control the devices from the IPhone; They required middleware. We decided to use a simple local JS server to parse information and use it to control the smart home devices. 


If you didn't take the time to read the blog post, I'll quickly summarize how it works in as simple terms as possible. We configure a prompt that gives the model details about our environment and the response we are looking for. The prompt should be specific to your own setup, so remember to adjust it to your own smart home setup. Also, once you understand the flow of the program, feel free to change the prompt if you come up with a better structure for request. The purpose of this repo is simply to provide a template/starting point for your smart home ecosystem. The following is the exact prompt we came up with in our demo:


![image](https://user-images.githubusercontent.com/77647164/231701017-9e47f1cf-2870-4122-9695-3178e6cf1c77.png)

We can then give requests, and the model generate some action that it thinks is best fit for the request. 

##### Example: 
###### Request: 
- "I'm about to record a demo in the studio, but it's a bit dark in here."

###### Response: 
```
{
"action": "command",
"location": "studio",
"target": "switch",
"value": "on",
"comment": "Turning on the lights in the studio to help you record your demo.",
"delay": 0
}
```


This information is then sent to out controller, who completes our request by calling an API on our local Home Assistant instance.


## Control Flow 
### High Level Control Flow
![Screenshot from 2023-04-11 01-41-39](https://user-images.githubusercontent.com/77647164/231105308-f57b391c-039d-4254-88e6-6e34ad562109.png)


### Shortcuts Flow 

One feature we added is the ability to create conversations with multiple back and forth Requests and Responses. 

![Screenshot from 2023-04-13 23-44-37](https://user-images.githubusercontent.com/77647164/231976030-ad82ac9b-5e8f-4b58-9b7c-e300271b85e0.png)



## Configuration

### Installing Linux Box

// TODO

### Setting up Home Assistant

#### Adding devices
Once your all setup in Home Assistant, you can begin adding your devices via Zigbee. Once your devices have been added, it's important to change the entity ID of your devices to follow a convetion. **NOTE:** This is not optional. Devices are connected through this naming convention, and will not work otherwise.

![Screenshot from 2023-04-14 00-38-21](https://user-images.githubusercontent.com/77647164/231976686-e3b6e945-2cfe-47b5-bed2-06a391a6c6c0.png)


##### Temperature: sensor.{location}{property}

-ex: sensor.officetemperature

##### Other sensors {watersensor,motionsensor,doorsensor}:
- binary_sensor.{location}{sensorname}
  
##### Smart Plug:
- switch.{location}plug
  
##### Smart Light Switch:
- switch.{location}lightswitch
  
##### Smart Blinds:
- cover.{location}blinds

Routine: Routines are just automations under the hood. Setup automations as you normally would, and configure a name that best fits the automation (such as 'departure' or 'arrival' as we have done. 

![Screenshot from 2023-04-14 00-40-38](https://user-images.githubusercontent.com/77647164/231977453-7e8e95fe-3673-4da2-a30c-dc730cfad7df.png)


#### Obtaining an API Key
In order to access Home Assistant through its REST API endpoints, you need to provide an API key in the header of your response. You can obtain an access token in the Profile section of the Home Assistant UI. You will need this later on when you setup your controller so your JS program can call Home Assistant services.
![image](https://user-images.githubusercontent.com/77647164/231636869-110e272f-acdb-4073-97c2-17e23668d779.png)

  
### Setting up Controller

#### Getting started

Open up a new file and clone the github rep
```
git clone https://github.com/thirdreality/thingything
```
Install dependencies 
```
npm install
```

#### Setup

Input your Home Assistant API key into the variable.


```
haToken = "yourapitoken"
```


Input the location of your local home assistant API URL.
This is defaulted at http://localhost:8123/api/, so you shouldn't need to change anything.

```
const homesAssistantAPIURL ="http://localhost:8123/api/";
```


### Run your application

#### To run your application, run the following in the terminal
```
npm start
```

### Shortcuts
The Shortcut can be found [here](https://www.icloud.com/shortcuts/2aa16fc785d8484da8e229a622d46726) . You will need your own openai API Token. A tutorial of obtaining an key can be found [here](https://www.youtube.com/watch?v=nafDyRsVnXU&ab_channel=TutorialsHub). 
Once you have your API key, place it into the header section of your request. You'll also need to put the location of your controller in the command and query section of shortcuts. This can be found by running *ifconfig* in your terminal to get your ip address. The port is defaulted at *8080*, but feel free to change it if that port is already occupied. 


## Some food for thought (Future Ideas)

### Cloud implementation
Currently, our integration is all done locally, which means that smarthome commands cannot be called from outside the home network. However, setting up your controller in the cloud （EC2, etc) would allow you to control your smart home from anywhere with internet connection, and would save you the trouble of having to consiously keep your server running. 

### Fine tuning

As shown in the control flow, we are continuosly calling the API with the entire prompt, as well as previous recorded conversations, which seems unintuitive. Fine tuning the model would provide a numerous amounts of benefits, including:
- Lower Tokens (lower cost). The cost of each API request depends on the load, or the number of tokens. Since we only need to pass in the users request (as opposed to the entire prompt + request), a huge portion of the load is removed.
- Lower Latency. Another consequence of a lower load is a faster response as the model does not need to process as much information with each call
- More consistant, higher quality responses. Since you are manually training the modal, it will better be able to parse the patterns and nuances of your requests, and will provice higher quality responses more consistantly.

Clearly fine tuning is far superior. The only downside really is that it takes a lot of information and resources to configure well. If you are looking to build a lasting Home Assistant ecosystem, I suggest you consider trying this out yourself.

### Integration with Google/Alexa
We haven't dabbled too much with Google/Alexa, but we imagine that it could also be done with similar apps.

  
