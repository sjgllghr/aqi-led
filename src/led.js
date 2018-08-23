const Gpio = require('onoff').Gpio;
const green = new Gpio(20, 'out');
const red1 = new Gpio(16, 'out');
const red2 = new Gpio(12, 'out');
const red3 = new Gpio(25, 'out');
const red4 = new Gpio(24, 'out');
const strongRed = new Gpio(23, 'out');

const leds = [green, red1, red2, red3, red4, strongRed];

process.on('SIGINT', shutdown); 
process.on('SIGTERM', shutdown);

// Turns off all LEDs before exiting
function shutdown() {
	console.log('Shutting down');
	for (let i = 0; i < leds.length; i++) {
		leds[i].writeSync(0);
	}
    process.exit();
}

// Sets the first and last LEDs only
function setErrorLEDs() {
	for (let i = 1; i < leds.length -1; i++) {
		leds[i].writeSync(0);
	}

	green.writeSync(1);
	strongRed.writeSync(1);	
}

// Resets the LED display to fit the current AQI level
// All lights up to level should be on, all after off
function updateLEDs(level) {
	lightPrevious(level);
	clearRemaining(level);
}

// Turns on all LEDs up to and including level
function lightPrevious(level) {
	for (let i = 0; i <= level; i++) {
		leds[i].writeSync(1);
	}
}

// Turns off all LEDs after level
function clearRemaining(level) {
	for (let i = level + 1; i < leds.length; i++) {
		leds[i].writeSync(0);
	} 
}

module.exports = { updateLEDs, setErrorLEDs };
