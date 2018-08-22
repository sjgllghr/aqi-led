const Gpio = require('pigpio').Gpio;
const green = new Gpio(20, {mode: Gpio.OUTPUT});
const red1 = new Gpio(16, {mode: Gpio.OUTPUT});
const red2 = new Gpio(12, {mode: Gpio.OUTPUT});
const red3 = new Gpio(25, {mode: Gpio.OUTPUT});
const red4 = new Gpio(24, {mode: Gpio.OUTPUT});
const strongRed = new Gpio(23, {mode: Gpio.OUTPUT});

const leds = [green, red1, red2, red3, red4, strongRed];

process.on('SIGINT', () => {
	console.log('Shutting down');
	for (let i = 0; i < leds.length; i++) {
		leds[i].pwmWrite(0);
	}
	process.exit();
});

function setErrorLEDs() {
	for (let i = 1; i < leds.length -1; i++) {
		leds[i].pwmWrite(0);
	}

	green.pwmWrite(100);
	strongRed.pwmWrite(100);	
}

function updateLEDs(level) {
	lightPrevious(level);
	clearRemaining(level);
}

function lightPrevious(level) {
	for (let i = 0; i <= level; i++) {
		leds[i].pwmWrite(200);
	}
}

function clearRemaining(level) {
	for (let i = level + 1; i < leds.length; i++) {
		leds[i].pwmWrite(0);
	} 
}

module.exports = { updateLEDs, setErrorLEDs };
