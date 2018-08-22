const leds = require('./led');
const LEVELS = require('./constants').LEVELS;

let level = 0;

setInterval(() => {
	if (level >= LEVELS ) {
		leds.setErrorLEDs();
	} else {
		leds.updateLEDs(level);
	}
	
	level++;

	if (level > LEVELS) {
		level = 0;
	}
}, 2000);
