# aqi-led
An air quality display that allows you to visualize what your lungs are already telling you. Takes AQI data from airnow.gov and displays the severity level of the current air rating on LEDs.

## Requirements
- Raspberry Pi with internet connection
- Docker for Raspberry Pi or Raspbian Jessie with node v8.11.4
- Breadboard, 6 LEDs, 6 resistors (~200 ohms), wires, etc.

## Setup
### Download
```
git clone https://github.com/sjgllghr/aqi-led.git
```

### Assembly
<img src="https://github.com/sjgllghr/aqi-led/blob/docs/hardware/aqi_led_.png" alt="hardware diagram" width="500"/>

Basic steps:
- Connect each of the pins 20, 16, 12, 25, 24 and 23 to the long leg (anode) of an LED 
- Connect each of the LED short legs (cathodes) to a resistor 
- Connect each of the resistors to ground
- Connect Raspberry Pi ground to breadboard ground

Hardware schematics are in the [hardware folder](https://github.com/sjgllghr/aqi-led/tree/docs/hardware).

## Usage
### Using npm
```
npm install
npm start -- <ZIPCODE> [INTERVAL (ms)]
```
Interval argument is optional and defaults to ten minutes.

### Using docker
Build the container:
```
docker build -t "docker_aqi:v1" .
```
Run the container:
```
docker container run --privileged  -e zip=<ZIPCODE> -e interval=[INTERVAL] -d docker_aqi:v1
```
Interval defaults to ten minutes, zip defaults to 98101 (Seattle). Privileged flag is necessary to get access to GPIO.

Stop the container:
```
docker stop <container ID>
```
This should turn off all of the LEDs before shutting down.

### Testing
Tests can be found in test/ folder and run with:
```
sudo npm test
```
`sudo` is needed here to access GPIO. 

### Linting
There is also a pretest run for eslint that can be run independently with:
```
npm run pretest
```

### Demo
To loop through all the lighting states:
```
npm run demo
```
Which should look something like:  

![](https://github.com/sjgllghr/aqi-led/blob/docs/demo/demo.gif)

With each severity level having an increasing amount of LEDs lit, and an error display state of just the first and last LED.
