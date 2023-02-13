import Sorter  from './Sorter';
import { COMPARE_RESULT } from '../../utils';

const heapSort = (array, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);

    const heapify = (lo, hi) => {
        let parent = lo;
        let child = parent * 2 + 1;
        while(child < hi){
            if(child + 1 < hi && sorter.compareIndexesWithCondition(child, child + 1, COMPARE_RESULT.LESS_THAN)) child++;
            if(sorter.compareIndexesWithCondition(parent, child, COMPARE_RESULT.GREATER_THAN)) break;
            sorter.swap(parent, child);
            parent = child;
            child = parent * 2 + 1;
        }
    }

    const buildHeap = (lo, hi) => {
        let parent = Math.floor((hi - 1) / 2);
        while(parent >= lo){
            heapify(parent, hi);
            parent--;
        }
    }

    buildHeap(0, sorter.arrayLength);
    let hi = sorter.arrayLength - 1;
    while(hi > 0){
        sorter.swap(0, hi, false, true);
        heapify(0, hi);
        hi--;
    }

    if(sorter.arrayLength > 0) sorter.final([0]);

    return sorter.result;
}

export default heapSort;