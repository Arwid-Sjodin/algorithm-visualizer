const SORT_OPERATION_TYPES = {
    FINAL: "FINAL",
    WRITE: "WRITE",
    READ: "READ",
    NONE: "NONE",
}

class SortOperation {
    constructor(){}
    
    apply = (array) => {
        throw new Error("Abstract method");
    }
}

class FinalOperation extends SortOperation {
    constructor(finalIndexes){
        super();
        this._finalIndexes = [...finalIndexes];
    }

    apply = (array) => {
        return {
            array, 
            accessedIndexes : [],
            finalIndexes : this._finalIndexes,
            operationType : SORT_OPERATION_TYPES.FINAL
        };
    }
}

class WriteOperation extends SortOperation {
    constructor(writeIndexes, values, finalIndexes){
        super();
        this._writeIndexes = [...writeIndexes];
        this._values = [...values]
        this._finalIndexes = [...finalIndexes];
    }

    apply = (array) => {
        this._writeIndexes.forEach((index, i) => {
            array[index] = this._values[i];
        });
        return {
            array, 
            accessedIndexes : this._writeIndexes,
            finalIndexes : this._finalIndexes,
            operationType : SORT_OPERATION_TYPES.WRITE
        };
    }
}

class ReadOperation extends SortOperation {
    constructor(readIndexes){
        super();
        this._readIndexes = [...readIndexes];
    }

    apply = (array) => {
        return {
            array, 
            accessedIndexes : this._readIndexes,
            finalIndexes : [], 
            operationType : SORT_OPERATION_TYPES.READ
        };
    }
}

/**
 * Modifies the array based on the operation and returns information about the operation
 * @param {Array} array 
 * @param {SortOperation} operation 
 * @returns {array, accessedIndexes, finalIndexes, operationType} 
 */
const applyOperation = (array, operation) => { return operation.apply(array) };

export { 
    SORT_OPERATION_TYPES,
    SortOperation,
    FinalOperation,
    WriteOperation,
    ReadOperation,
    applyOperation,
};