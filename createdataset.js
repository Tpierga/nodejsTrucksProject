const R = require('ramda')
const ObjectsToCsv = require('objects-to-csv');

const truck_speed = 0.025  //miles per seconds
const capacity = 50

arrayDataset = []

/**
 *
 * model of the dict object with keys
oneOfferPrev =
    {
        pricePerBox:0,
        boxes:0,
        travel:0,
        timeSinceLast: 0,
        valueOfCourse: 0, // total value generated if offer accepted
        valuePerMile:0, // ratio of value
        distanceTruck1:0, // distance the truck has to cover before course end
        distanceTruck2:0,
        distanceTruck3:0,
        distanceTruck4:0,
        distanceTruck5:0,
        takeCommand: 0 // it is 1 if the offer was accepted
    }
 **/

//first offer being placed
const oneOffer= {
    pricePerBox: Math.ceil(Math.random() * 10),
    boxes: Math.floor(Math.random() * 100),
    travel: Math.floor(Math.random() * 1000),
    timeSinceLast: Math.floor(Math.random() * 10000)
}

// calculating the number of trucks needed to transport the boxes, and the value generated
let nb_cargos = Math.floor(oneOffer['boxes']/capacity) + 1;
oneOffer['valueOfCourse']=0
for(i=0; i<nb_cargos-1; i++)
{
    oneOffer['valueOfCourse'] += capacity * oneOffer['pricePerBox'] //quotient
}
oneOffer['valueOfCourse']+= oneOffer['boxes']%capacity * oneOffer['pricePerBox'] // remainder
oneOffer['valuePerMile'] = oneOffer['valueOfCourse'] / oneOffer['travel']

let listTrucks = []
oneOffer['distanceTruck1'] = 0;
listTrucks.push(oneOffer['distanceTruck1'])
oneOffer['distanceTruck2'] = 0;
listTrucks.push(oneOffer['distanceTruck2'])
oneOffer['distanceTruck3'] = 0;
listTrucks.push(oneOffer['distanceTruck3'])
oneOffer['distanceTruck4'] = 0;
listTrucks.push(oneOffer['distanceTruck4'])
oneOffer['distanceTruck5'] = 0;
listTrucks.push(oneOffer['distanceTruck5'])

oneOffer['takeCommand'] = 1;
nb_truck_loaded = 0
for (i = 0; i<listTrucks.length; i++)
{
    if (listTrucks[i]==0)
    {
        oneOffer['distanceTruck'+(i+1).toString()]=oneOffer['travel'];
        nb_truck_loaded +=1;
        if (nb_truck_loaded==nb_cargos)
        {
            break;
        }
    }
}
// end of first offer

console.log(oneOffer);

oneOfferPrev = oneOffer;
arrayDataset.push(oneOffer);
let t = 1;
let somme = oneOfferPrev['valuePerMile'];
let benef = oneOfferPrev['valueOfCourse'];

while (t<10000)
{

    const oneOffer= {
        pricePerBox: Math.ceil(Math.random() * 10),
        boxes: Math.floor(Math.random() * 100),
        travel: Math.floor(Math.random() * 1000),
        timeSinceLast: Math.floor(Math.random() * 10000)
    }

    let nb_cargos = Math.floor(oneOffer['boxes']/capacity) + 1;
    oneOffer['valueOfCourse']=0
    for(i=0; i<nb_cargos-1; i++)
    {
        oneOffer['valueOfCourse'] += capacity * oneOffer['pricePerBox'] //quotient
    }
    oneOffer['valueOfCourse']+= oneOffer['boxes']%capacity * oneOffer['pricePerBox'] // remainder
    oneOffer['valuePerMile'] = oneOffer['valueOfCourse'] / oneOffer['travel']

    let distance_covered= oneOffer["timeSinceLast"] * truck_speed ;
    console.log('distance covered : ' + distance_covered.toString());

    let listTrucks = []
    oneOfferPrev['distanceTruck1'] > distance_covered ? oneOffer['distanceTruck1'] = Math.floor(oneOfferPrev['distanceTruck1'] - distance_covered): oneOffer['distanceTruck1']=0;
    listTrucks.push(oneOffer['distanceTruck1'])
    oneOfferPrev['distanceTruck2'] > distance_covered ? oneOffer['distanceTruck2'] = Math.floor(oneOfferPrev['distanceTruck2'] - distance_covered): oneOffer['distanceTruck2']=0;
    listTrucks.push(oneOffer['distanceTruck2'])
    oneOfferPrev['distanceTruck3'] > distance_covered ? oneOffer['distanceTruck3'] = Math.floor(oneOfferPrev['distanceTruck3'] - distance_covered): oneOffer['distanceTruck3']=0;
    listTrucks.push(oneOffer['distanceTruck3'])
    oneOfferPrev['distanceTruck4'] > distance_covered ? oneOffer['distanceTruck4'] = Math.floor(oneOfferPrev['distanceTruck4'] - distance_covered): oneOffer['distanceTruck4']=0;
    listTrucks.push(oneOffer['distanceTruck4'])
    oneOfferPrev['distanceTruck5'] > distance_covered ? oneOffer['distanceTruck5'] = Math.floor(oneOfferPrev['distanceTruck5'] - distance_covered): oneOffer['distanceTruck5']=0;
    listTrucks.push(oneOffer['distanceTruck5'])

    console.log('value per Mile : ', oneOffer['valuePerMile']);
    if (oneOffer['valuePerMile']!==Infinity)
    {
        t+=1;
        somme= somme + oneOffer['valuePerMile'];
        averageValue = somme/t;
        console.log("average value per mile : " + averageValue.toString());
    }
    else
    {
        console.log("value was Infinity");
    }




    const whoIsParked = c => c==0 ? 1:0;
    let nb_trucks_ready = R.reduce((a,b) => a + b, 0, R.map(whoIsParked, listTrucks));

    if (oneOffer['valuePerMile']>=averageValue/2 && nb_trucks_ready>=nb_cargos)
    {
        oneOffer['takeCommand'] = 1;
        nb_truck_loaded = 0
        for (i = 0; i<listTrucks.length; i++)
        {
            if (listTrucks[i]==0)
            {
                oneOffer['distanceTruck'+(i+1).toString()]=oneOffer['travel'];
                nb_truck_loaded +=1;
                if (nb_truck_loaded==nb_cargos)
                {
                    break;
                }
            }
        }
    }
    else
    {
        oneOffer['takeCommand'] = 0;
    }

    console.log(oneOffer);
    oneOfferPrev = oneOffer;
    if (oneOffer['takeCommand']===1)
    {
        benef += oneOffer['valueOfCourse']; // TODO should be added only when truck returns
    }
    console.log("total benef : " + benef.toString()+"\n\n");
    arrayDataset.push(oneOffer);
}

(async () => {
    const csv = new ObjectsToCsv(arrayDataset);
    await csv.toDisk('./offers.csv');
})();



//automatically decide for each line if you send truck or not, by actuallising the mean of gain in file

























