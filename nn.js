const brain = require('brain.js');
const R = require('ramda');

const trainNN = (data) => {
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
};

const prepareData = R.map(
    R.pipe(
        R.applySpec({
            input: {
                pricePerBox: R.prop('pricePerBox'),
                boxes: R.prop('boxes'),
                travel: R.prop('travel'),
                timeSinceLast: R.prop('timeSinceLast'),
                valueOfCourse: R.prop('valueOfCourse'),
                valuePerMile: R.prop('valuePerMile'),
                distanceTruck1: R.prop('distanceTruck1'),
                distanceTruck2: R.prop('distanceTruck2'),
                distanceTruck3: R.prop('distanceTruck3'),
                distanceTruck4: R.prop('distanceTruck4'),
                distanceTruck5: R.prop('distanceTruck5'),
            },
            output:R.pipe(R.prop('takeCommand'), Number, R.of)
        }),
        R.over(R.lensProp('input'), R.values)
    )
);

module.exports = {trainNN, prepareData};

