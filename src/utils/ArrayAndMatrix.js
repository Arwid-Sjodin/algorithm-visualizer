import { randomInt } from './Number.js';


// creates an array of random integers 
const createRandomIntArray = (length, min, max) => {
    return Array(length).fill().map(() => randomInt(min, max));
}

//creates a matrix and fills with given value
const createMatrix = (height, width, value) => {
    const matrix = [];
    for (let i = 0; i < height; i++) {
        matrix.push(new Array(width).fill(value));
    }
    return matrix;
}

// Returns an array of numbers from 0 to n
function createAscendingArray(n) {
    return createAscendingRange(0, n);
}

//included i and n
function createAscendingRange(i, n) {
    return Array.from({ length: n - i + 1 }, (_, index) => index + i);
}


//Turn every element in an array of intergers into the % value of the max value
//Round to full percent
function convertToPercentages(array) {
    const max = Math.max(...array);
    return array.map((value) => Math.round(value / max * 100));
}

const shuffle = (array) => {
    return array.sort(() => 0.5 - Math.random());
}

const randomShuffledArray = (arrayLength) => {
    const array = createRandomIntArray(arrayLength, 1, 100);
    return convertToPercentages(array);
}

const randomAscendingArray = (arrayLength) => {
    let array = randomShuffledArray(arrayLength);
    array.sort((a, b) => a - b);
    return array;
}

const randomDescendingArray = (arrayLength) => {
    let array = randomShuffledArray(arrayLength);
    array.sort((a, b) => b - a);
    return array;
}

const randomRealisticArray = (arrayLength) => {
    let array = randomAscendingArray(arrayLength);
    const tenth = Math.floor(arrayLength / 10);
    const firstThirdIndex = Math.floor(arrayLength / 3);
    const secondThirdIndex = firstThirdIndex * 2;

    const randomIndexes = shuffle([
        randomInt(0, firstThirdIndex - tenth),
        randomInt(firstThirdIndex, secondThirdIndex - tenth),
        randomInt(secondThirdIndex, arrayLength - tenth)
    ]);

    const randomArrays = [
        createRandomIntArray(tenth, Math.min(...array), array[randomIndexes[0] + tenth]),
        createRandomIntArray(tenth, Math.min(...array), Math.max(...array)),
        createRandomIntArray(tenth, array[randomIndexes[2]], array[randomIndexes[2] + tenth])
    ];

    for(let i = 0; i < tenth; i++){
        array[randomIndexes[0] + i] = randomArrays[0][i];
        array[randomIndexes[1] + i] = randomArrays[1][i];
        array[randomIndexes[2] + i] = randomArrays[2][i];
    }

    return convertToPercentages(array);
}

const isAscending = (array) => {
    for(let i = 0; i < array.length - 1; i++){
        if(array[i] > array[i+1]) return false;
    }
    return true;
}

const isDescending = (array) => {
    for(let i = 0; i < array.length - 1; i++){
        if(array[i] < array[i+1]) return false;
    }
    return true;
}

export {
    createRandomIntArray,
    createMatrix,
    createAscendingArray,
    convertToPercentages,
    randomShuffledArray,
    randomAscendingArray,
    randomDescendingArray,
    randomRealisticArray,
    isAscending,
    isDescending,
    createAscendingRange,
}