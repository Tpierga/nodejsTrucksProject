const R = require('ramda');
const fs = require('fs-extra');

const fileReader_ = (x) => fs.readFile(x, 'utf-8');

const parseToSomeType_ = R.curry((type, n, array) =>
    R.pipe(R.nth(n), R.unless(R.isEmpty, type))(array)
);

const parseToNumber_ = parseToSomeType_(Number);
const parseToBoolean_ = parseToSomeType_(R.pipe(Number, Boolean));
const nameHandler_ = R.pipe((a, b) => `${a}, ${b}`, R.replace(/"/g, ''));

const parseLine = R.pipe(
    R.split(','),
    R.applySpec({
        pricePerBox: parseToNumber_(0),
        boxes: parseToNumber_(1),
        travel: parseToNumber_(2),
        timeSinceLast: parseToNumber_(3),
        valueOfCourse: parseToNumber_(4), // total value generated if offer accepted
        valuePerMile: parseToNumber_(5), // ratio of value
        distanceTruck1: parseToNumber_(6), // distance the truck has to cover before course end
        distanceTruck2: parseToNumber_(7),
        distanceTruck3: parseToNumber_(8),
        distanceTruck4: parseToNumber_(9),
        distanceTruck5: parseToNumber_(10),
        takeCommand: parseToBoolean_(11)
    })
);

const parseFile = R.pipe(R.split('\n'), R.tail, R.map(parseLine));
const readAndParseFile = R.pipe(fileReader_, R.andThen(parseFile));

module.exports = {readAndParseFile};







