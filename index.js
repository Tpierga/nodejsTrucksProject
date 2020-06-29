const offers = require('./async-js');
const R = require('ramda');
const {prepareData, trainNN} = require('./nn');
const {filterEmptyLines, readAndParseFile} = require('./parser');
const {createDatasetAndReturnAverage} = require('./createdataset');
//this is our listener. the functions should be called here.
//start with parsing file
let benef = 0;

async function sendTruck(value, travelTime) {
        let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(value), travelTime)
        });
        let amountMoney = await promise;
        benef = benef+amountMoney;
        console.log("Total benef :"+benef.toString());

}

let listoffer = [];
let prevTime = Date.now();

// all the trucks have a maximum capacity of 50 boxes
const capacity = 50

// the speed is the number of miles covered by seconds
const truckSpeed = 0.025

const nbTrucks = 5;

const profitable = createDatasetAndReturnAverage()/2;

console.log("value above which a course is considered profitable :"+profitable.toString());


prevOffer =
    {
            pricePerBox:0,
            boxes:0,
            travel:0,
            timeSinceLast: 0,
            valueOfCourse: 0, // total value generated if offer accepted
            valuePerMile:0 // ratio of value

    }
var i;
for (i=0;i<nbTrucks; i++)
{
        prevOffer['distanceTruck'+i.toString()]=0
}




// This is the event receiver waiting for offers to arrive
offers.marketEvent.on('New Offer', (offer) => {

        let currTime = Date.now()
        offer['timeSinceLast'] = currTime-prevTime;

        let nb_cargos = Math.floor(offer['boxes']/capacity) + 1;
        offer['valueOfCourse']=0
        for(i=0; i<nb_cargos-1; i++)
        {
                offer['valueOfCourse'] += capacity * offer['pricePerBox'] //quotient
        }
        offer['valueOfCourse']+= offer['boxes']%capacity * offer['pricePerBox'] // remainder

        offer['valuePerMile'] = offer['valueOfCourse'] / offer['travel']

        let distance_covered = offer["timeSinceLast"] * truckSpeed ;
        console.log('distance covered : ' + distance_covered.toString());

        let listTrucks = []
        var i;
        for (i = 0; i<nbTrucks; i++) {
                // check if the trucks have finished there travel and update distance remaining

                prevOffer['distanceTruck' + i.toString()] > distance_covered ? offer['distanceTruck'+i.toString()] = Math.floor(prevOffer['distanceTruck'+i.toString()] - distance_covered): offer['distanceTruck'+i.toString()]=0;
                listTrucks.push(offer['distanceTruck'+i.toString()])
        }

        const whoIsParked = c => c==0 ? 1:0;

        // calculating the numbers of trucks remaining
        let nb_trucks_ready = R.reduce((a,b) => a + b, 0, R.map(whoIsParked, listTrucks));

        // here we decide if it is possible to accept the offer and if it is, is it a good choice to accept it ?
        if (offer['valuePerMile']>=profitable && nb_trucks_ready>=nb_cargos)
        {
                offer['takeCommand'] = 1;
                for (i = 0; i <= nb_cargos-1; i++) {
                        if (listTrucks[i] == 0) {
                                offer['distanceTruck' + i.toString()] = offer['travel'];

                        }
                }
        sendTruck(offer['valueOfCourse'], (offer['travel']/truckSpeed));

        }
        else {
                offer['takeCommand'] = 0;
        }

        R.pipe(R.append(offer), R.tap(console.log))(listoffer);
        prevOffer = offer;
        prevTime = currTime;
});

offers.launchEmitter();


//testData = prepareData(offerTest);

//net = R.pipeWith(R.andThen, [readAndParseFile, prepareData, trainNN])('./offers.csv', testData)










