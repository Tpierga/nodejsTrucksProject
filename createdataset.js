const R = require('ramda');
const ObjectsToCsv = require('objects-to-csv');

function createDatasetAndReturnAverage() {
    let oneOfferPrevious = {
        pricePerBox: 0,
        boxes: 0,
        travel: 0,
        timeSinceLast: 0,
        valueOfCourse: 0, // Total value generated if offer accepted
        valuePerMile: 0, // Ratio of value
        distanceTruck1: 0, // Distance the truck has to cover before course end
        distanceTruck2: 0,
        distanceTruck3: 0,
        distanceTruck4: 0,
        distanceTruck5: 0,
        takeCommand: 0 // It is 1 if the offer was accepted
    };

    const truckSpeed = 0.025; // Miles per seconds
    const capacity = 50;

    const checkDistanceCovered = (distA, distB, dTruck) => {
        distA > distB ? (dTruck = Math.floor(distA - distB)) : (dTruck = 0);
        return dTruck;
    };

    const arrayDataset = [];
    // First offer being placed
    const oneOffer = {
        pricePerBox: Math.ceil(Math.random() * 10),
        boxes: Math.floor(Math.random() * 100),
        travel: Math.floor(Math.random() * 1000),
        timeSinceLast: Math.floor(Math.random() * 10000)
    };

    // Calculating the number of trucks needed to transport the boxes, and the value generated
    const nbCargos = Math.floor(oneOffer.boxes / capacity) + 1;
    oneOffer.valueOfCourse = 0;
    for (let i = 0; i < nbCargos - 1; i++) {
        oneOffer.valueOfCourse += capacity * oneOffer.pricePerBox; // Quotient
    }

    oneOffer.valueOfCourse += (oneOffer.boxes % capacity) * oneOffer.pricePerBox; // Remainder
    oneOffer.valuePerMile = oneOffer.valueOfCourse / oneOffer.travel;

    const listTrucks = [];
    oneOffer.distanceTruck1 = 0;
    listTrucks.push(oneOffer.distanceTruck1);
    oneOffer.distanceTruck2 = 0;
    listTrucks.push(oneOffer.distanceTruck2);
    oneOffer.distanceTruck3 = 0;
    listTrucks.push(oneOffer.distanceTruck3);
    oneOffer.distanceTruck4 = 0;
    listTrucks.push(oneOffer.distanceTruck4);
    oneOffer.distanceTruck5 = 0;
    listTrucks.push(oneOffer.distanceTruck5);

    oneOffer.takeCommand = 1;
    let nbTruckLoaded = 0;
    for (const [i, listTruck] of listTrucks.entries()) {
        if (listTruck === 0) {
            oneOffer['distanceTruck' + (i + 1).toString()] = oneOffer.travel;
            nbTruckLoaded += 1;
            if (nbTruckLoaded === nbCargos) {
                break;
            }
        }
    }
    // End of the first offer

    // Const previousOffer = oneOffer;
    arrayDataset.push(oneOffer);
    let t = 1;
    let somme = oneOfferPrevious.valuePerMile;
    // Const benef = oneOfferPrevious.valueOfCourse;
    let averageValue = 0;

    while (t < 5000) {
        const oneOffer = {
            pricePerBox: Math.ceil(Math.random() * 10),
            boxes: Math.floor(Math.random() * 100),
            travel: Math.floor(Math.random() * 1000),
            timeSinceLast: Math.floor(Math.random() * 10000)
        };

        const nbCargos = Math.floor(oneOffer.boxes / capacity) + 1;
        oneOffer.valueOfCourse = 0;
        for (let i = 0; i < nbCargos - 1; i++) {
            oneOffer.valueOfCourse += capacity * oneOffer.pricePerBox; // Quotient
        }

        oneOffer.valueOfCourse +=
            (oneOffer.boxes % capacity) * oneOffer.pricePerBox; // Remainder
        oneOffer.valuePerMile = oneOffer.valueOfCourse / oneOffer.travel;

        const distanceCovered = oneOffer.timeSinceLast * truckSpeed;

        // Check if the trucks have finished there travel and update distance remaining
        // Check if the trucks have finished there travel and update distance remaining
        const listTrucks = [];
        listTrucks.push(
            checkDistanceCovered(
                oneOfferPrevious.distanceTruck1,
                distanceCovered,
                oneOffer.distanceTruck1
            )
        );
        // OneOfferPrevious.distanceTruck1 > distanceCovered ? oneOffer.distanceTruck1 = Math.floor(oneOfferPrevious.distanceTruck1 - distanceCovered) : oneOffer.distanceTruck1 = 0;
        // listTrucks.push(oneOffer.distanceTruck1);
        listTrucks.push(
            checkDistanceCovered(
                oneOfferPrevious.distanceTruck2,
                distanceCovered,
                oneOffer.distanceTruck2
            )
        );
        // OneOfferPrevious.distanceTruck2 > distanceCovered ? oneOffer.distanceTruck2 = Math.floor(oneOfferPrevious.distanceTruck2 - distanceCovered) : oneOffer.distanceTruck2 = 0;
        // listTrucks.push(oneOffer.distanceTruck2);
        listTrucks.push(
            checkDistanceCovered(
                oneOfferPrevious.distanceTruck3,
                distanceCovered,
                oneOffer.distanceTruck3
            )
        );
        // OneOfferPrevious.distanceTruck3 > distanceCovered ? oneOffer.distanceTruck3 = Math.floor(oneOfferPrevious.distanceTruck3 - distanceCovered) : oneOffer.distanceTruck3 = 0;
        // listTrucks.push(oneOffer.distanceTruck3);
        listTrucks.push(
            checkDistanceCovered(
                oneOfferPrevious.distanceTruck4,
                distanceCovered,
                oneOffer.distanceTruck4
            )
        );
        // OneOfferPrevious.distanceTruck4 > distanceCovered ? oneOffer.distanceTruck4 = Math.floor(oneOfferPrevious.distanceTruck4 - distanceCovered) : oneOffer.distanceTruck4 = 0;
        // listTrucks.push(oneOffer.distanceTruck4);
        listTrucks.push(
            checkDistanceCovered(
                oneOfferPrevious.distanceTruck5,
                distanceCovered,
                oneOffer.distanceTruck5
            )
        );
        // OneOfferPrevious.distanceTruck5 > distanceCovered ? oneOffer.distanceTruck5 = Math.floor(oneOfferPrevious.distanceTruck5 - distanceCovered) : oneOffer.distanceTruck5 = 0;
        // listTrucks.push(oneOffer.distanceTruck5);

        if (oneOffer.valuePerMile !== Infinity) {
            t += 1;
            somme += oneOffer.valuePerMile;
            averageValue = somme / t;
        }

        const whoIsParked = (c) => (c === 0 ? 1 : 0);

        // Calculating the numbers of trucks remaining
        const nbTrucksReady = R.reduce(
            (a, b) => a + b,
            0,
            R.map(whoIsParked, listTrucks)
        );

        if (
            oneOffer.valuePerMile >= averageValue / 2 &&
            nbTrucksReady >= nbCargos
        ) {
            oneOffer.takeCommand = 1;
            nbTruckLoaded = 0;
            for (const [i, listTruck] of listTrucks.entries()) {
                if (listTruck === 0 && nbTruckLoaded === nbCargos) {
                    oneOffer['distanceTruck' + (i + 1).toString()] = oneOffer.travel;
                    nbTruckLoaded += 1;
                }
            }
        } else {
            oneOffer.takeCommand = 0;
        }

        oneOfferPrevious = oneOffer;
    }

    (async () => {
        const csv = new ObjectsToCsv(arrayDataset);
        await csv.toDisk('./offers.csv');
    })();

    return averageValue;
}

module.exports = {createDatasetAndReturnAverage};

// Automatically decide for each line if you send truck or not, by actuallising the mean of gain in file
