import Sorter  from './Sorter';
import { COMPARE_RESULT } from '../../utils';
import { insertionSortSubArray } from "./InsertionSort";

const medianOfThree = (sorter, lo, hi) => {
    let mid = Math.floor((lo + hi) / 2);
    const greaterThan = (a, b) => sorter.compareIndexesWithCondition(a, b, COMPARE_RESULT.GREATER_THAN_OR_EQUAL);

    if((greaterThan(mid, lo) && greaterThan(hi, mid)) ||
        (greaterThan(mid, hi) && greaterThan(lo, mid))){
        return mid;
    }

    if((greaterThan(lo, mid) && greaterThan(hi, lo)) ||
        (greaterThan(lo, hi) && greaterThan(mid, lo))){
        return lo;
    }

    return hi;
}

const takeFirst = (sorter, lo, hi) => lo;

const partition = (sorter, lo, hi, pivotSelector) => {
    let pivot = pivotSelector(sorter, lo, hi);
    sorter.swap(pivot, lo);
    pivot = lo;
    lo ++;
    while(true){
        while(lo <= hi && (sorter.compareIndexesWithCondition(lo, pivot, COMPARE_RESULT.LESS_THAN_OR_EQUAL)))
            lo++;
        while(lo <= hi && (sorter.compareIndexesWithCondition(hi, pivot, COMPARE_RESULT.GREATER_THAN_OR_EQUAL)))
            hi--;

        if(lo>hi) break;

        sorter.swap(lo, hi);
        lo ++;
        hi --;
    }
    sorter.swap(pivot, hi);
    sorter.final([hi]);
    return hi;
}

const quicksortSubarray = (sorter, lo, hi, pivotSelector, cutoff) => {
    let size = hi - lo;
    if(size < 0) return;
    if(size == 0){
        sorter.final([lo]);
    }
    else if(size < cutoff){
        insertionSortSubArray(sorter, lo, hi);
    }
    else{
        const mid = partition(sorter, lo, hi, pivotSelector);
        quicksortSubarray(sorter, lo, mid-1, pivotSelector, cutoff);
        quicksortSubarray(sorter, mid+1, hi, pivotSelector, cutoff);
    }
}

const quickSort = (array, pivotSelector, cutoff, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);
    quicksortSubarray(sorter, 0, sorter.arrayLength - 1, pivotSelector, cutoff);
    return sorter.result;
}

const quickSortMedianOfThree = (array, key) => {
    return quickSort(array, medianOfThree, 0, key);
}

const quickSortTakeFirst = (array, key) => {
    return quickSort(array, takeFirst, 0, key);
}

const quickSortCutoff = (array, key) => {
    return quickSort(array, medianOfThree, 10, key);
}

export {
    quickSortMedianOfThree,
    quickSortTakeFirst,
    quickSortCutoff,
}