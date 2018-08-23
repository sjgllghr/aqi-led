const aqi = require('./aqi');
const led = require('./led');

const LEVEL_STRINGS = require('./constants').LEVEL_STRINGS;

const TEN_MINUTES = 600000;
const TEN_SECONDS = 10000;

let zip = process.argv[2];

if (zip == undefined) {
    console.log("Usage: npm start -- <ZIPCODE>");
    process.exit();
}

updateDisplay(zip);
setInterval(() => updateDisplay(zip), TEN_SECONDS); 

function updateDisplay(zip) {
    aqi.getAQI(zip).then((rating) => {
        let level = aqi.ratingSeverity(rating);
        console.log(rating + ' -- ' + LEVEL_STRINGS[level]);
        led.updateLEDs(level);
    }).catch((err) => {
    	if (err) {
            console.error(err);
	    }

        console.log('Unable to get AQI data');
	    led.setErrorLEDs();
    });
}
