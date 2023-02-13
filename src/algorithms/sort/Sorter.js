import {
    WriteOperation,
    ReadOperation,
    FinalOperation,
} from './SortOperation.js';

import SORT_RESULT from './SortResult.js'
import { compare, COMPARE_RESULT, compareCondition } from '../../utils';

class Sorter {
    constructor() {
        this._reset();
    }

    _reset = () => {
        this._key = null;
        this._operations = [];
        this._array = [];
    }

    init = (array, key = (x) => x) => {
        this._key = key;
        this._array = array.slice();
    }

    get result() {
        return new SORT_RESULT(this._array, this._operations);
    }

    get arrayLength() {
        return this._array.length;
    }

    findMax = (low, high) => {
        let max = low;
        for (let i = low; i < high; i++) {
            if (this.compareIndexesWithCondition(i, max, COMPARE_RESULT.GREATER_THAN)) {
                max = i;
            }
        }
        return max;
    }

    done = () => {
        this.final(this._array.map((_, i) => i));
    }

    write = (index, value, final = false) => {
        this._writeMany([index], [value], final ? [index] : []);
    }
        
    swap = (index1, index2, final1 = false, final2 = false) => {
        let indexes = [index1, index2];
        let finals = (final1 ? [index1] : []).concat(final2 ? [index2] : []);
        let elems = this._readMany(indexes);
        this._writeMany([index2, index1], elems, finals);
    }

    read = (readIndex) => {
        return this._readMany([readIndex])[0];
    }

    _readMany = (readIndexes)  => {
        this._checkIndexes(readIndexes);
        const operation = new ReadOperation(readIndexes);
        this._operations.push(operation);
        return readIndexes.map((index) => this._array[index]);
    }

    _writeMany = (writeIndexes, values, finalIndexes = []) => {
        this._checkIndexes(writeIndexes);
        if(!this._validIndexArray(finalIndexes)) throw new Error("Invalid final indexes");
        if(writeIndexes.length != values.length){
            throw new Error("Indexes and values must be the same length");
        }

        const operation = new WriteOperation(writeIndexes, values, finalIndexes);
        this._operations.push(operation);

        writeIndexes.forEach((index, i) => this._array[index] = values[i]);
    }
    
    final = (finalIndexes) => {
        this._checkIndexes(finalIndexes);

        const operation = new FinalOperation(finalIndexes);
        this._operations.push(operation);
    }

    _checkIndexes = (indexes) => {
        if(this._emptyIndexArray(indexes) || !this._validIndexArray(indexes)) throw new Error("Invalid indexes" + indexes);
    }

    _emptyIndexArray = (indexes) => indexes == null || indexes.length == 0;
    
    _validIndexArray = (indexes) => {
        return indexes.every((index) => index >= 0 && index < this._array.length);
    }

    compareSwap = (index1, index2, condition, final1=false, final2=false) => {
        this._checkIndexes([final1, final2, index1, index2]);
        let result = this.compareIndexesWithCondition(index1, index2, condition);
        if (result) this.swap(index1, index2, final1, final2);
        return result;
    }

    compareIndexesWithCondition = (index1, index2, condition) => {
        const indexes = [index1, index2];
        this._checkIndexes(indexes);
        let [elem1, elem2] = this._readMany(indexes);
        return this._compareWithCondition(elem1, elem2, condition);
    }

    compareIndexes(index1, index2) {
        const indexes = [index1, index2];
        this._checkIndexes(indexes);
        let [elem1, elem2] = this._readMany(indexes);
        return this._compareElements(elem1, elem2);
    }

    _compareWithCondition(elem1, elem2, condition) {
        this._comparisonCount++;
        return compareCondition(elem1, elem2, condition, this._key);
    }

    _compareElements(elem1, elem2) {
        this._comparisonCount++;
        return compare(elem1, elem2, this._key);
    }
}

export default Sorter;