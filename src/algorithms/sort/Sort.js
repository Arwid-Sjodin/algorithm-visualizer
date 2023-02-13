import {
    mergeSort
} from "./MergeSort";
import {
    quickSortMedianOfThree,
    quickSortTakeFirst,
    quickSortCutoff,
}from "./QuickSort";
import {
    insertionSort,
} from "./InsertionSort";
import bubbleSort from "./BubbleSort";
import selectionSort from "./SelectionSort";
import heapSort from "./HeapSort";

const SORT_ALGORITHMS = {
    MERGE_SORT: "Merge Sort",
    QUICK_SORT_MEDIAN: "Quick Sort (Median)",
    QUICK_SORT_FIRST: "Quick Sort (First)",
    QUICK_SORT_CUTOFF: "Quick Sort (Cutoff)",
    INSERTION_SORT: "Insertion Sort",
    BUBBLE_SORT: "Bubble Sort",
    SELECTION_SORT: "Selection Sort",
    HEAP_SORT: "Heap Sort",
}

const SORT_ALGORITHMS_MAP = new Map([
    [SORT_ALGORITHMS.MERGE_SORT, mergeSort],
    [SORT_ALGORITHMS.QUICK_SORT_MEDIAN, quickSortMedianOfThree],
    [SORT_ALGORITHMS.QUICK_SORT_FIRST, quickSortTakeFirst],
    [SORT_ALGORITHMS.QUICK_SORT_CUTOFF, quickSortCutoff],
    [SORT_ALGORITHMS.INSERTION_SORT, insertionSort],
    [SORT_ALGORITHMS.BUBBLE_SORT, bubbleSort],
    [SORT_ALGORITHMS.SELECTION_SORT, selectionSort],
    [SORT_ALGORITHMS.HEAP_SORT, heapSort],
]);



/**
    Sort an array using the specified algorithm. Does not mutate the original array.
    @param {string} algorithm - The name of the sort algorithm to use.
    @param {Array} array - The array to sort.
    @param {function} key - The key function to use to compare elements.
    @throws {Error} If the specified algorithm is not found in the SORT_ALGORITHMS_MAP.
    @returns {SORT_RESULT} The result of the sort algorithm. Includes the sorted array and operations required to sort the array.
*/
const sort = (algorithm, array, key = (x) => x) => {
    let algo = SORT_ALGORITHMS_MAP.get(algorithm);
    if(algo === undefined) throw new Error("Algorithm not found");
    return algo(array, key);
}

export {
    SORT_ALGORITHMS,
    sort,
}
