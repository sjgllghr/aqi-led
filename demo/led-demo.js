// Iterates through all AQI level displays and error display

const leds = require('../src/led');
const LEVELS = require('../src/constants').LEVELS;

let level = 0;

setInterval(() => {
	if (level >= LEVELS) {
		leds.setErrorLEDs();
	} else {
		leds.updateLEDs(level);
	}
	
	level += 1;

	if (level > LEVELS) {
		level = 0;
	}
}, 2000);

process.on('SIGINT', () => {
    leds.turnOffLEDs();
    process.exit();
});
