import { Queue } from "../../dataStructures";
import { SEARCH_RESULT, SearchEntry, computePath } from "./PathFindUtils";

function bfs(graph, src, dest) {
    let searchQueue = new Queue();
    let visited = new Set();
    let iterations = 0;

    searchQueue.enqueue(new SearchEntry(src, null, null));

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
            searchQueue.enqueue(new SearchEntry(edge.end, edge, current));
        }

    }
    return new SEARCH_RESULT(false, visited, iterations, []);
}

export default bfs;
