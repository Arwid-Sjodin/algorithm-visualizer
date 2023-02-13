
// Generates a random integer between the given minimum and maximum values (inclusive)
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min * 1) + min);
}

const getValue = (percentage, maxValue) => {
    return maxValue - Math.floor((percentage * maxValue));
}

export { 
    randomInt,
    getValue,
};
