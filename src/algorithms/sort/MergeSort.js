import { Queue} from '../../dataStructures';
import { COMPARE_RESULT } from '../../utils';
import Sorter  from './Sorter';

const merge = (queue, sorter, lo, mid, maxHi, finalMerge) => {
    let i = lo;
    let j = mid;
    let z = lo;

    while(i < mid && j <= maxHi) {
        if(sorter.compareIndexesWithCondition(i, j, COMPARE_RESULT.LESS_THAN)) {
            queue.enqueue(sorter.read(i++));
            sorter.write(z++, queue.dequeue(), finalMerge);
        } else {
            queue.enqueue(sorter.read(j++));
        }
    }
    while(i < mid) {
        queue.enqueue(sorter.read(i++));
        sorter.write(z++, queue.dequeue(), finalMerge);
    }
    while(j <= maxHi) {
        queue.enqueue(sorter.read(j++));
    }
    while(!queue.isEmpty()) {
        sorter.write(z++, queue.dequeue(), finalMerge);
    }

}

const mergesortSubarray = (queue, sorter, lo, hi, finalMerge=false) => {
    if(lo >= hi) return;
    let mid = Math.floor((lo + hi) / 2);
    mergesortSubarray(queue, sorter, lo, mid);
    mergesortSubarray(queue, sorter, mid + 1, hi);
    merge(queue, sorter, lo, mid + 1, hi, finalMerge);
}

const mergeSort = (array, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);

    if(sorter.arrayLength == 1){
        sorter.final([0]);
        return sorter.result;
    }

    let queue = new Queue();

    mergesortSubarray(queue, sorter, 0, sorter.arrayLength - 1, true);
    return sorter.result;
}

export {
    mergeSort,
    merge, 
    mergesortSubarray,
}