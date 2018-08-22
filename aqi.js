const request = require('request');
const led = require('./led');

const LEVELS = require('./constants').LEVELS;

const FIVE_MINUTES = 300000;
const FIVE_SECONDS = 5000;

let zip = process.argv[2];

if (zip == undefined) {
    console.log("Usage: node aqi.js <ZIPCODE>");
    process.exit();
}

setInterval(() => {
    request({
        uri: 'https://airnow.gov/index.cfm?action=airnow.local_city&zipcode=' + zip + '&submit=Go'
    }, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }

        let tag = body.indexOf('/images/aqi_unh_lg.gif');

        if (tag == -1) {
            console.log("Unable to get AQI data");
	    led.setErrorLEDs();	
        } else {
            let startTag = body.indexOf('>', tag);
            let endTag = body.indexOf("</td>", startTag);
            let rating = body.substring(startTag + 1, endTag).trim();
            let level = ratingSeverity(rating);

            console.log(rating);
            console.log(level);

            led.updateLEDs(level);
        }
    });
}, FIVE_SECONDS);

function ratingSeverity(rating) {
    let index = Math.floor((rating - 1) / 50);
    if (index >= LEVELS) {
        index = LEVELS - 1;
    }

    return index;
}
