const request = require('request');
const led = require('./led');

const LEVELS = require('./constants').LEVELS;

const TEN_MINUTES = 600000;
const TEN_SECONDS = 10000;

let zip = process.argv[2];

if (zip == undefined) {
    console.log("Usage: npm start -- <ZIPCODE> OR sudo node aqi.js <ZIPCODE>");
    process.exit();
}

// Gets the current AQI rating for the provided zipcode and updates the LED
// display according to severity or errors.
setInterval(() => {
    request({
        uri: 'https://airnow.gov/index.cfm?action=airnow.local_city&zipcode=' + zip + '&submit=Go'
    }, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }
	
	// The first instance of this is unique to the AQI rating element
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
}, TEN_SECONDS);

// Takes in an AQI rating and returns the severity of that rating
// More about levels can be found here: https://airnow.gov/index.cfm?action=aqibasics.aqi
function ratingSeverity(rating) {
    let level = Math.floor((rating - 1) / 50);
    if (level >= LEVELS) {
        level = LEVELS - 1;
    }

    return index;
}
