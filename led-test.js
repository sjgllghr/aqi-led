const Gpio = require('onoff').Gpio;
const LED = new Gpio(24, 'out');
const blinkInterval = setInterval(blinkLED, 250);

function blinkLED() {
	if (LED.readSync() === 0) {
		LED.writeSync(1);
		console.log(0);
	} else {
		LED.writeSync(0);
		console.log(1);
	}
}

function endBlink() {
	clearInterval(blinkInterval);
	LED.writeSync(0);
	LED.unexport();
}

setTimeout(endBlink, 5000);
