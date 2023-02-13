import Sorter  from './Sorter';
import { COMPARE_RESULT } from '../../utils';

const selectionSort = (array, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);

    const n = sorter.arrayLength;
    for(let i = 0; i < n; i++){
        let min = i;
        for(let j = i+1; j < n; j++){
            sorter.compareSwap(j, min, COMPARE_RESULT.LESS_THAN);
        }
        sorter.swap(i, min);
        sorter.final([i]);
    }

    return sorter.result;
}

export default selectionSort;