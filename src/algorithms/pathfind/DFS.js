import { SEARCH_RESULT, SearchEntry, computePath } from "./PathFindUtils";

function dfs(graph, src, dest){
    let searchStack = [];
    let visited = new Set();
    let iterations = 0;

    searchStack.push(new SearchEntry(src, null, null));

    while(searchStack.length !== 0) {
        iterations++;
        let current = searchStack.pop();
        if(visited.has(current.vertex)) continue;
        visited.add(current.vertex);

        if(current.vertex === dest) {
            return new SEARCH_RESULT(true, visited, iterations, computePath(current));
        }

        for(let edge of graph.outgoingEdges(current.vertex)){
            if(visited.has(edge.end)) continue;
            searchStack.push(new SearchEntry(edge.end, edge, current));
        }
    }
    return new SEARCH_RESULT(false, visited, iterations, []);
}

export default dfs;