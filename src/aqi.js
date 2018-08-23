const request = require('request');

// Gets the current AQI rating for the provided zipcode
function getAQI(zip) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://airnow.gov/index.cfm?action=airnow.local_city&zipcode=' + zip + '&submit=Go'
        }, (err, response, body) => {
            if (err) {
                reject(err);
            }
	
            // The first instance of this is unique to the AQI rating element
            let tag = body.indexOf('background="/images/aqi_');

            if (tag == -1) {
                // Element containing AQI data not found, usually means site
                // is down or invalid zip
                reject('AQI not found');
            } else {
                let startTag = body.indexOf('>', tag);
                let endTag = body.indexOf("</td>", startTag);
                let rating = body.substring(startTag + 1, endTag).trim();

                resolve(rating);
            }
        });
    });
}

// Takes in an AQI rating and returns the severity of that rating
// More about levels can be found here: https://airnow.gov/index.cfm?action=aqibasics.aqi
function ratingSeverity(rating) {
    if (rating < 0) throw new Error('Invalid rating');
    if (rating == 0) return 0;

    // First four categories increment by 50, then 100, then all else
    if (rating < 201) {
        return Math.floor((rating - 1) / 50);
    } else if (rating < 301) {
        return 4;
    } else {
        return 5;
    }
}

module.exports = { getAQI, ratingSeverity };
