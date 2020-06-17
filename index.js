const offers = require('./async-js');
const R = require('ramda');
const {prepareData, trainNN} = require('./nn');
const {filterEmptyLines, readAndParseFile} = require('./parser');
//this is our listener. the functions should be called here.
//start with parsing file

//recoitOffreAndDecideIfYouSendtruck
//add line to file
let listoffer = [];

/**
offers.marketEvent.on('New Offer', (offer) => {
R.pipe(R.append(offer), R.tap(console.log))(listoffer);
});

send_truck_async()
    //afficher des trucs en console sur le déplacement du camion
    //dire quand le camion est arrive
    //cahnger la valeur du camion

offers.launchEmitter();

**/

R.pipeWith(R.andThen, [readAndParseFile, prepareData, trainNN])('./offers.csv');

















