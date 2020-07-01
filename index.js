const offers = require('./async-js');
const R = require('ramda');
// Const {prepareData, trainNN} = require('./nn');
// Const {filterEmptyLines, readAndParseFile} = require('./parser');
const {createDatasetAndReturnAverage} = require('./createdataset');
// This is our listener. the functions should be called here.
// Start with parsing file
let benef = 0;

async function sendTruck(value, travelTime) {
    const promise = new Promise((resolve) => {
        setTimeout(() => resolve(value), travelTime);
    });
    const amountMoney = await promise;
    benef += amountMoney;
    console.log('Benefice total :' + benef.toString());
}

const listoffer = [];
let previousTime = Date.now();

// All the trucks have a maximum capacity of 50 boxes
const capacity = 50;

// The speed is the number of miles covered by seconds
const truckSpeed = 0.025;

const nbTrucks = 5;

const profitable = createDatasetAndReturnAverage() / 5;

console.log(
    'value above which a course is considered profitable :' +
    profitable.toString()
);

let previousOffer = {
    pricePerBox: 0,
    boxes: 0,
    travel: 0,
    timeSinceLast: 0,
    valueOfCourse: 0, // Total value generated if offer accepted
    valuePerMile: 0 // Ratio of value
};

for (let i = 0; i < nbTrucks; i++) {
    previousOffer['distanceTruck' + i.toString()] = 0;
}

// This is the event receiver waiting for offers to arrive
offers.marketEvent.on('New Offer', (offer) => {
    const currTime = Date.now();
    offer.timeSinceLast = currTime - previousTime;

    const nbCargos = Math.floor(offer.boxes / capacity) + 1;
    offer.valueOfCourse = 0;
    for (let i = 0; i < nbCargos - 1; i++) {
        offer.valueOfCourse += capacity * offer.pricePerBox; // Quotient
    }

    offer.valueOfCourse += (offer.boxes % capacity) * offer.pricePerBox; // Remainder

    offer.valuePerMile = offer.valueOfCourse / offer.travel;

    const distanceCovered = offer.timeSinceLast * truckSpeed;
    console.log('distance covered : ' + distanceCovered.toString());

    const listTrucks = [];
    for (let i = 0; i < nbTrucks; i++) {
        // Check if the trucks have finished there travel and update distance remaining

        previousOffer['distanceTruck' + i.toString()] > distanceCovered
            ? (offer['distanceTruck' + i.toString()] = Math.floor(
            previousOffer['distanceTruck' + i.toString()] - distanceCovered
            ))
            : (offer['distanceTruck' + i.toString()] = 0);
        listTrucks.push(offer['distanceTruck' + i.toString()]);
    }

    const whoIsParked = (c) => (c === 0 ? 1 : 0);

    // Calculating the numbers of trucks remaining
    const nbTrucksReady = R.reduce(
        (a, b) => a + b,
        0,
        R.map(whoIsParked, listTrucks)
    );

    // Here we decide if it is possible to accept the offer and if it is, is it a good choice to accept it ?
    if (offer.valuePerMile >= profitable && nbTrucksReady >= nbCargos) {
        offer.takeCommand = 1;
        for (let i = 0; i <= nbCargos - 1; i++) {
            if (listTrucks[i] === 0) {
                offer['distanceTruck' + i.toString()] = offer.travel;
            }
        }

        sendTruck(offer.valueOfCourse, offer.travel / truckSpeed);
    } else {
        offer.takeCommand = 0;
    }

    R.pipe(R.append(offer), R.tap(console.log))(listoffer);
    previousOffer = offer;
    previousTime = currTime;
});

offers.launchEmitter(); // Envoie une offre

// testData = prepareData(offerTest);
//
// net = R.pipeWith(R.andThen, [readAndParseFile, prepareData, trainNN])('./offers.csv', testData)
