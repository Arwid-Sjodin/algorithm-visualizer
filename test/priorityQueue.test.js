import {IndexedPriorityQueue} from "../src/dataStructures";

class TestPQEntry {
    constructor(item, value) {
        this.item = item;
        this.value = value;
    }
}

const createTestPQ = () => {
    return new IndexedPriorityQueue(
        (entry) => entry.item,
        (entry) => entry.value
    );
};

        
describe('IndexedPriorityQueue', () => {
    it('should export IndexedPriorityQueue', () => {
        expect(IndexedPriorityQueue).toBeDefined();
    });

    const pq = createTestPQ();
    pq.enqueue(new TestPQEntry("A", 10));
    pq.enqueue(new TestPQEntry("C", 30));
    pq.enqueue(new TestPQEntry("B", 2));
    pq.enqueue(new TestPQEntry("G", 12));
    pq.enqueue(new TestPQEntry("F", 100));

    it('should add items to the queue', () => {
        expect(pq.size()).toBe(5);
        expect(pq._items.length).toBe(5);
        expect(pq._idToIndex.size).toBe(5);
    });

    it('Top item should be the smallest', () => {
        expect(pq.peek().item).toBe("B");
    });

    it('dequeue should return the smallest item and remove it from the queue', () => {
        expect(pq.dequeue().item).toBe("B");
        expect(pq.size()).toBe(4);
        expect(pq.dequeue().item).toBe('A');
        expect(pq.dequeue().item).toBe('G');
        expect(pq.dequeue().item).toBe('C');
        expect(pq.dequeue().item).toBe('F');
        expect(pq.size()).toBe(0);
        expect(pq._items.length).toBe(0);
        expect(pq._idToIndex.size).toBe(0);
    });

    it('Enqueuing an already existing item should not work. But it should update the priority if the new priority is better', () => {
        pq.enqueue(new TestPQEntry("A", 10));
        pq.enqueue(new TestPQEntry("B", 2));
        pq.enqueue(new TestPQEntry("C", 3));
   
        pq.enqueue(new TestPQEntry("A", 1));
        expect(pq.peek().item).toBe("A");
        expect(pq.size()).toBe(3);

        pq.enqueue(new TestPQEntry("A", 10));
        expect(pq.peek().item).toBe("A");

        expect(pq.size()).toBe(3);

        pq.dequeue();
        expect(pq.peek().item).toBe("B");
    });

});



