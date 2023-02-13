class ListNode {
    constructor(elem) {
        this.elem = elem;
        this.prev = null;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this._front = null;
        this._rear = null;
        this._size = 0;
    }

    isEmpty() {
        return this._size == 0;
    }

    size() {
        return this._size;
    }

    clear() {
        this._front = null;
        this._rear = null;
        this._size = 0;
    }

    enqueue(item) {
        let node = new ListNode(item);
        if (this.isEmpty()) {
            this._front = node;
            this._rear = node;
        } else {
            this._rear.next = node;
            node.prev = this._rear;
            this._rear = node;
        }
        this._size++;
    }

    dequeue() {
        if (this.isEmpty()) throw new Error("Queue is empty");
        let node = this._front;
        this._front = this._front.next;
        if (this._front == null) {
            this._rear = null;
        } else {
            this._front.prev = null;
        }
        this._size--;
        return node.elem;
    }

    peek() {
        if (this.isEmpty()) throw new Error("Queue is empty");
        return this._front.elem;
    }
}

export default Queue;