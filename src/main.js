const aqi = require('./aqi');
const led = require('./led');

const LEVEL_STRINGS = require('./constants').LEVEL_STRINGS;

const TEN_MINUTES = 600000;

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

let zip = process.argv[2];
let interval = process.argv[3];

if (interval == undefined) {
    interval = TEN_MINUTES;
}

if (zip == undefined) {
    console.log("Usage: npm start -- <ZIPCODE> [INTERVAL(ms)]");
    process.exit();
}

updateDisplay(zip);
setInterval(() => updateDisplay(zip), interval); 

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

function shutdown() {
    console.log('Shutting Down');
    led.turnOffLEDs();
    process.exit();
}
