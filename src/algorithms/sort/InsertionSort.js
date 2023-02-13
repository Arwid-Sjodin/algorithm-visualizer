
import { createAscendingArray, 
    COMPARE_RESULT, 
    createAscendingRange, 
} from '../../utils';
import Sorter  from './Sorter';

const insertionSort = (array, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);
    insertionSortSubArray(sorter, 0, sorter.arrayLength-1, true);
    return sorter.result;
}

const insertionSortSubArray = (sorter, lo, hi, finalSort=true) => {

    const insertLeft = (index, final) => {
        let j = index;
        while(j>lo && sorter.compareIndexesWithCondition(j-1, j, COMPARE_RESULT.GREATER_THAN)){
            sorter.swap(j-1, j, false, final);
            j--;
        }
        return j;
    }

    let i = lo;

    for(i; i<hi; i++){
        insertLeft(i, false);
    }

    if(i === hi){
        insertLeft(i, finalSort);
        if(finalSort) sorter.final(createAscendingRange(lo, i));
    }
}


export {
    insertionSort,
    insertionSortSubArray,
}
