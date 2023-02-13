
import {     
    SORT_RESULT,
    SORT_OPERATION_TYPES,
    applyOperation,
    SORT_ALGORITHMS,
    sort,
} from '../src/algorithms';
import { createRandomIntArray } from '../src/utils';

describe('sort', () => {
    it('should export SORT_RESULT', () => {
        expect(SORT_RESULT).toBeDefined();
    });
    it('should export SORT_OPERATION_TYPES', () => {
        expect(SORT_OPERATION_TYPES).toBeDefined();
    });
    it('should export applyOperation', () => {
        expect(applyOperation).toBeDefined();
    });
    it('should export SORT_ALGORITHMS', () => {
        expect(SORT_ALGORITHMS).toBeDefined();
    });
    it('should export sort', () => {
        expect(sort).toBeDefined();
    });
});


const testArrays = [
    {
        input: [1, 2, 3],
        key: (x) => x,
        expected: [1, 2, 3],
    },
    {
        input: [3, 2, 1],
        key: (x) => x,
        expected: [1, 2, 3],
    },
    {
        input: [{a: 1}, {a: 2}, {a: 3}],
        key: (x) => x.a,
        expected: [{a: 1}, {a: 2}, {a: 3}],
    },
    {
        input: [{a: 3}, {a: 2}, {a: 1}],
        key: (x) => x.a,
        expected: [{a: 1}, {a: 2}, {a: 3}],
    },
    {
        input: ['a', 'b', 'c'],
        key: (x) => x,
        expected: ['a', 'b', 'c'],
    },
    {
        input: ['c', 'b', 'a'],
        key: (x) => x,
        expected: ['a', 'b', 'c'],
    },
];

for(let i = 0; i <= 100; i++) {
    const array = createRandomIntArray(i, 0, 100);
    const sortedArray = array.slice().sort((a, b) => a - b);
    testArrays.push({
        input: array,
        key: (x) => x,
        expected: sortedArray,
    });
}


const test = (algorithm) => {
    
    const results = [];
    
    for(let i = 0; i < testArrays.length; i++) {
        const inputArray = testArrays[i].input.slice();
        const key = testArrays[i].key;
        const result = sort(algorithm, inputArray, key);
        results.push(result);
    }

    it(`${algorithm} result should include a sorted array`, () => {
        for(let i = 0; i < testArrays.length; i++) {
            const expectedArray = testArrays[i].expected;
            const result = results[i];
            expect(result).toBeInstanceOf(SORT_RESULT);
            expect(result.sortedArray).toEqual(expectedArray);
        }
    });

    it(`${algorithm} result should include valid operations to apply to the input array to get the sorted array`, () => {
        for(let i = 0; i < testArrays.length; i++) {
            const inputArray = testArrays[i].input;
            const result = results[i];

            let arrayToSort = inputArray.slice();
            const finalIndexes = new Set();
            result.operations.forEach(operation => {
                const operationResult = applyOperation(arrayToSort, operation);
                operationResult.finalIndexes.forEach(index => finalIndexes.add(index));
            });

            expect(arrayToSort).toEqual(result.sortedArray);

            for(let i = 0; i < inputArray.length; i++) {
                expect(finalIndexes.has(i)).toBeTruthy();
            }
        }
    });

}

describe('Quick Sort (Median)', () => {
    test(SORT_ALGORITHMS.QUICK_SORT_MEDIAN);
});

describe('Quick Sort (Cutoff)', () => {
    test(SORT_ALGORITHMS.QUICK_SORT_CUTOFF);
});

describe('Quick Sort (First)', () => {
    test(SORT_ALGORITHMS.QUICK_SORT_FIRST);
});

describe('Insertion Sort', () => {
    test(SORT_ALGORITHMS.INSERTION_SORT);
});

describe('Bubble Sort', () => {
    test(SORT_ALGORITHMS.BUBBLE_SORT);
});

describe('Selection Sort', () => {
    test(SORT_ALGORITHMS.SELECTION_SORT);
});

describe('Heap Sort', () => {
    test(SORT_ALGORITHMS.HEAP_SORT);
});

describe('Merge Sort', () => {
    test(SORT_ALGORITHMS.MERGE_SORT);
});

it('should throw an error when algorithm not found', () => {
    expect(() => sort('Non-existing Algorithm', [], (x) => x)).toThrow();
});











