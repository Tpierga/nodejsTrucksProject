const offers = require('./async-js');
const R = require('ramda');
const {prepareData, trainNN} = require('./nn');
const {filterEmptyLines, readAndParseFile} = require('./parser');
//this is our listener. the functions should be called here.
//start with parsing file


let listoffer = [];
let prevTime = Date.now();

// all the trucks have a maximum capacity of 50 boxes
const capacity = 50

// the speed is the number of miles covered by seconds
const truck_speed = 0.025

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

        let distance_covered = offer["timeSinceLast"] * truck_speed ;
        console.log('distance covered : ' + distance_covered.toString());

        R.pipe(R.append(offer), R.tap(console.log))(listoffer);
        prevOffer = offer;
        prevTime = currTime;


});

offers.launchEmitter();


let offerTest =
    {
        pricePerBox: 7,
        boxes: 21,
        travel: 956,
        timeSinceLast: 815,
        valueOfCourse: 147,
        valuePerMile: 0.15376569037656904,
        distanceTruck1: 15,
        distanceTruck2: 15,
        distanceTruck3: 0,
        distanceTruck4: 0,
        distanceTruck5: 0
    }

//testData = prepareData(offerTest);

//net = R.pipeWith(R.andThen, [readAndParseFile, prepareData, trainNN])('./offers.csv', testData)










