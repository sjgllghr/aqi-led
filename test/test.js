const expect = require('chai').expect;
const rewire = require('rewire');

const led = require('../src/led');
const aqi = require('../src/aqi');

const ledRewire = rewire('../src/led');

const ratingSeverity = aqi.ratingSeverity;

const leds = ledRewire.__get__('leds');

function turnOffLEDs() {
    for (let i = 0; i < leds.length; i++) {
        leds[i].writeSync(0);
    }
}

describe('ratingSeverity()', function () {
    it('should throw an error for negative inputs', function() {
        expect(() => ratingSeverity(-1)).to.throw('Invalid rating');
        expect(() => ratingSeverity(0)).not.to.throw('Invalid rating');   
    });

    it('should give a severity rating between 0 and 5 inclusive', function() {
        expect(ratingSeverity(0)).to.be.equal(0);
        expect(ratingSeverity(5000)).to.be.equal(5);
    });

    it('should correctly categorize ratings at boundaries', function() {
        expect(ratingSeverity(50)).to.be.equal(0);
        expect(ratingSeverity(51)).to.be.equal(1);

        expect(ratingSeverity(150)).to.be.equal(2);
        expect(ratingSeverity(151)).to.be.equal(3);

        expect(ratingSeverity(300)).to.be.equal(4);
        expect(ratingSeverity(301)).to.be.equal(5);
    });
});

describe('getAQI()', function() {
    it('should reject for invalid zip codes', function() {
        aqi.getAQI(99999).then(() => {
            expect.fail();
        }).catch((err) => {
            expect(err).to.be.equal('AQI not found');
        });
    });

    it('should return a value between 0 and 500 or so', async function() {
        try {
            let result = await aqi.getAQI(98101);
            expect(parseInt(result)).to.be.within(0, 600);
            return;
        } catch (err) {
            console.log(err);
            expect.fail();
        }     
    });
});

describe('led module setup', function() {
    it('should have six LEDs', function() {
        expect(leds.length).to.equal(6);

        for (let i = 0; i < leds.length; i++) {
            expect(leds[i]).to.not.be.undefined;
        }
    });

    it('should not have any LEDs on', function() {
        for (let i = 0; i < leds.length; i++) {
            expect(leds[i].readSync()).to.equal(0);
        }
    });
});

describe('setErrorLEDs()', function() {
    it('should light up first and last LEDs', function() {
        led.setErrorLEDs();
        expect(leds[0].readSync()).to.equal(1);
        expect(leds[5].readSync()).to.equal(1);
    });

    it('should not light up any of the other LEDs', function() {
        for (let i = 1; i < leds.length - 1; i++) {
            expect(leds[i].readSync()).to.equal(0);
        }
    });

    after(turnOffLEDs);
});

describe('updateLEDs()', function() {
    it('should light up all LEDs for level 5', function() {
        led.updateLEDs(5);
        for (let i = 0; i < leds.length; i++) {
            expect(leds[i].readSync()).to.equal(1);
        }
    });

    it('should only light up first LED for level 0', function() {
        led.updateLEDs(0);
        expect(leds[0].readSync()).to.equal(1);
        for (let i = 1; i < leds.length; i++) {
            expect(leds[i].readSync()).to.equal(0);
        }
    });

    it('should light up first three for level 2', function() {
        led.updateLEDs(2);
        for (let i = 0; i <= 2; i++) {
            expect(leds[i].readSync()).to.equal(1);
        }

        for (let i = 3; i < leds.length; i++) {
            expect(leds[i].readSync()).to.equal(0);
        }
    });

    after(turnOffLEDs);
});
