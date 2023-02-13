import {
    COMPARE_RESULT,
    compare,
    compareCondition,
    createRandomIntArray,
    createMatrix,
    createAscendingArray,
    randomInt,
} from '../src/utils';

describe('utils', () => {
    it('should export COMPARE_RESULT', () => {
        expect(COMPARE_RESULT).toBeDefined();
    });
    it('should export compare', () => {
        expect(compare).toBeDefined();
    });
    it('should export compareCondition', () => {
        expect(compareCondition).toBeDefined();
    });
    it('should export createRandomIntArray', () => {
        expect(createRandomIntArray).toBeDefined();
    });
    it('should export createMatrix', () => {
        expect(createMatrix).toBeDefined();
    });
    it('should export createAscendingArray', () => {
        expect(createAscendingArray).toBeDefined();
    });
    it('should export randomInt', () => {
        expect(randomInt).toBeDefined();
    });
});

describe('randomInt', () => {
    it('should return a random integer between min and max', () => {
        const min = 1;
        const max = 10;
        const randomInts = [];
        for (let i = 0; i < 100; i++) {
            randomInts.push(randomInt(min, max));
        }
        const minRandomInt = Math.min(...randomInts);
        const maxRandomInt = Math.max(...randomInts);
        expect(minRandomInt).toBeGreaterThanOrEqual(min);
        expect(maxRandomInt).toBeLessThanOrEqual(max);
    });
});

describe('createRandomIntArray', () => {
    it('should return an array of random integers between min and max', () => {
        const length = 100;
        const min = 1;
        const max = 10;
        const randomIntArray = createRandomIntArray(length, min, max);
        expect(randomIntArray.length).toEqual(length);
        expect(Math.min(...randomIntArray)).toBeGreaterThanOrEqual(min);
        expect(Math.max(...randomIntArray)).toBeLessThanOrEqual(max);
    });
});

describe('createMatrix', () => {
    it('should create a matrix of the given height and width with all elements set to the given value', () => {
        const height = 10;
        const width = 10;
        const value = 0;
        const matrix = createMatrix(height, width, value);
        expect(matrix.length).toEqual(height);
        expect(matrix[0].length).toEqual(width);
        matrix.forEach(row => {
        row.forEach(element => {
            expect(element).toEqual(value);
        });
        });
    });
    it('should create different arrays for each row', () => {
        const height = 10;
        const width = 10;
        const value = 0;
        const matrix = createMatrix(height, width, value);
        matrix.forEach((row, i) => {
            matrix.forEach((_, j) => {
                if (i !== j) {
                    expect(row).not.toBe(matrix[j]);
                }
            });
        });
    });
});
    
describe('createAscendingArray', () => {
    it('should create an array of numbers from 0 to n', () => {
        const n = 10;
        const ascendingArray = createAscendingArray(n);
        expect(ascendingArray.length).toEqual(n + 1);
        expect(ascendingArray[0]).toEqual(0);
        expect(ascendingArray[n]).toEqual(n);
    });
});