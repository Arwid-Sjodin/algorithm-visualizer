import Sorter  from './Sorter';
import { COMPARE_RESULT } from '../../utils';

const bubbleSort = (array, key) => {
    const sorter = new Sorter();
    sorter.init(array, key);

    const n = sorter.arrayLength;
    for(let i = 0; i < n; i++){
        for(let j = 0; j < n - i - 1; j++){
            sorter.compareSwap(j, j+1, COMPARE_RESULT.GREATER_THAN);
        }
        sorter.final([n-i-1]);
    }

    return sorter.result;
}

export default bubbleSort;