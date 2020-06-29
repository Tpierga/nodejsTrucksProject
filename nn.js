const brain = require('brain.js');
const R = require('ramda');
const scale = require('scale-number-range')

const trainNN = (data, testData) => {
    const netCfg = {
        hiddenLayers: [3],
        activation: 'sigmoid'
    };

    const trainCfg = {
        iterations: 20000,
        log: (x) => (R.not(x.iterations % 2000) ? console.log(x) : '')
    };

    const net = new brain.CrossValidate(brain.NeuralNetwork, netCfg);

    net.train(data, trainCfg);
    const output = net.run(testData);
    console.log(output);
};

const prepareData = R.map(
    R.pipe(
        R.applySpec({
            input: {
                pricePerBox: R.map(x => scale(x, 0, 10, 0, 1),R.prop('pricePerBox')),
                boxes: R.map(x => scale(x,0, 100, 0, 1),R.prop('boxes')),
                travel: R.map(x => scale(x, 0, 1000, 0, 1), R.prop('travel')),
                timeSinceLast: R.map(x => scale(x, 0, 10000, 0, 1), R.prop('timeSinceLast')),
                valueOfCourse: R.prop('valueOfCourse'),
                valuePerMile: R.prop('valuePerMile'),
                distanceTruck1: R.map(x => scale(x, 0, 1000, 0, 1),R.prop('distanceTruck1')),
                distanceTruck2: R.map(x => scale(x, 0, 1000, 0, 1),R.prop('distanceTruck2')),
                distanceTruck3: R.map(x => scale(x, 0, 1000, 0, 1),R.prop('distanceTruck3')),
                distanceTruck4: R.map(x => scale(x, 0, 1000, 0, 1),R.prop('distanceTruck4')),
                distanceTruck5: R.map(x => scale(x, 0, 1000, 0, 1),R.prop('distanceTruck5')),
            },
            output:R.pipe(R.prop('takeCommand'), Number, R.of)
        }),
        R.over(R.lensProp('input'), R.values)
    )
);


module.exports = {trainNN, prepareData};