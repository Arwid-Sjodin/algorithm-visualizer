import { IndexedPriorityQueue} from "../../dataStructures";
import { SEARCH_RESULT, SearchEntry, computePath } from "./PathFindUtils";

class DijkstraEntry extends SearchEntry {
    constructor(vertex, edgeToHere, previousEntry, cost) {
      super(vertex, edgeToHere, previousEntry);
      this.cost = cost;
    }
}

function dijkstra(graph, src, dest) {
    let searchQueue = new IndexedPriorityQueue((entry) => entry.vertex, (entry) => entry.cost);
    let visited = new Set();
    let iterations = 0;

    searchQueue.enqueue(new DijkstraEntry(src, null, null, 0));

    while(!searchQueue.isEmpty()) {
        iterations++;
        let current = searchQueue.dequeue();
        if(visited.has(current.vertex)) continue;
        visited.add(current.vertex);

        if(current.vertex === dest) {
            return new SEARCH_RESULT(true, visited, iterations, computePath(current));
        }
        
        for(let edge of graph.outgoingEdges(current.vertex)) {
            if(visited.has(edge.end)) continue;
            searchQueue.enqueue(new DijkstraEntry(edge.end, edge, current, current.cost + edge.weight));
        }
    
    }
    return new SEARCH_RESULT(false, visited, iterations, []);
}

export default dijkstra;