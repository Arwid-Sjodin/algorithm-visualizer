
import { compareCondition, COMPARE_RESULT } from "../utils";

class IndexedPriorityQueue{
    constructor(idKey, compareKey){
        this._idKey = idKey;
        this._compareKey = compareKey;
        this._items = [];
        this._idToIndex = new Map();
    }

    clear(){
        this._items = [];
        this._idToIndex = new Map();
    }

    isEmpty() {
        return this._items.length == 0;
    }

    size() {
        return this._items.length;
    }

    enqueue(item){
        if(this.contains(item)){
            this.updatePriority(item);
            return;
        }
        this._items.push(item);
        this._setID(item, this._items.length - 1);
        this._siftUp(this._items.length - 1); 
    }

    dequeue(){
        if(this._items.length === 0) throw new Error("dequeue from empty heap");
        let removed = this._items[0];
        this._deleteID(removed);
        let last = this._removeLast();
        if(this._items.length > 0){
            this._items[0] = last;
            this._setID(last, 0);
            this._siftDown(0);
        }
        return removed;
    }

    peek(){
        if(this._items.length === 0) throw new Error("peek from empty heap");
        return this._items[0];
    }

    contains(item){
        return this._idToIndex.has(this._toID(item));
    }

    updatePriority(item, force = false){
        if(!this.contains(item)){
            this.enqueue(item);
            return;
        }
        let index = this._idToIndex.get(this._toID(item));
        let currentItem = this._items[index];
        if(currentItem === undefined) throw new Error("Item should exist but is undefined");

        let improvement = this._itemCompare(item, currentItem);

        if(!force && !improvement) return;

        this._items[index] = item;
        if(improvement) this._siftUp(index);
        else this._siftDown(index);
    }


    _siftDown(pos){
        let heapSize = this._items.length;
        while(!this._isLeaf(pos)){
            let child = this._getLeftChild(pos);
            let right = child + 1;
            if(right < heapSize && this._itemAtCompare(right, child)){
                child = right;
            }
            if(!this._itemAtCompare(child, pos)){
                return pos;
            }
            this._swap(pos, child);
            pos = child;
        }
        return pos;
    }

    _siftUp(pos){
        while(pos > 0){
            let parent = this._getParent(pos);
            if(!this._itemAtCompare(pos, parent)){
                return pos;
            }
            this._swap(pos, parent);
            pos = parent;
        }
        return pos;
    }

    _buildHeap(){
        let heapSize = this._items.length;
        for(let pos = Math.floor(heapSize / 2) - 1; pos >= 0; pos--){
            this._siftDown(pos);
        }
    }

    _isLeaf(pos){
        return pos >= Math.floor(this._items.length / 2);
    }

    _getLeftChild(pos){
        return 2 * pos + 1;
    }

    _getRightChild(pos){
        return 2 * pos + 2;
    }

    _getParent(pos){
        return Math.floor ((pos - 1) / 2);
    }

    _swap(pos1, pos2){
        let item1 = this._items[pos1];
        let item2 = this._items[pos2];
        this._items[pos1] = item2;
        this._items[pos2] = item1;
        this._setID(item1, pos2);
        this._setID(item2, pos1);
    }

    _removeLast(){
        let last = this._items.pop();
        this._deleteID(last);
        return last;
    }

    _itemAtCompare(pos1, pos2){
        return this._itemCompare(this._items[pos1], this._items[pos2]);
    }

    _itemCompare(item1, item2){
        return compareCondition(item1, item2, COMPARE_RESULT.LESS_THAN, this._compareKey);
    }

    _setID(item, index){
        let ID = this._toID(item);
        this._idToIndex.set(ID, index);
    }

    _deleteID(item){
        let ID = this._toID(item);
        this._idToIndex.delete(ID);
    }

    _itemIndex(item){
        let ID = this._toID(item);
        return this._idToIndex.get(ID);
    }

    _toID = (item) => {
        return this._idKey(item);
    }
    
}

export default IndexedPriorityQueue;