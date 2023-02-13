import { mergeOperations } from "./SortOperation";

class SORT_RESULT {
    constructor(sortedArray, operations) {
        this.sortedArray = sortedArray;
        this.operations = operations;
    }
}

export default SORT_RESULT;