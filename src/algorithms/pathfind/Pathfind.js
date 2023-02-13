import bfs from "./BFS.js";
import dfs from "./DFS.js";
import dijkstra from "./Dijkstra.js";
import aStar from "./AStar.js";


const PATHFINDING_ALGORITHMS = {
	BFS: "BFS",
	DFS: "DFS",
  DIJKSTRA: "Dijkstra's",
  ASTAR: "A* Search",
}

const PATHFINDING_ALGORITHMS_MAP = new Map([
  [PATHFINDING_ALGORITHMS.BFS, bfs],
  [PATHFINDING_ALGORITHMS.DFS, dfs],
  [PATHFINDING_ALGORITHMS.DIJKSTRA, dijkstra],
  [PATHFINDING_ALGORITHMS.ASTAR, aStar],
]);


/**
    Find the shortest path between a source node and a destination node using the specified algorithm.
    @param {string} algorithm - The name of the pathfinding algorithm to use.
    @param {Graph} graph - The graph to search.
    @param {string} source - The node to start from.
    @param {string} destination - The the node to reach.
    @throws {Error} If the specified algorithm is not found in the PATHFINDING_ALGORITHMS_MAP.
    @returns {SEARCH_RESULT} The result of the pathfinding algorithm. Includes the path, visited nodes, and iterations.
*/
const pathfind = (algorithm, graph, source, destination) => {
  let algo = PATHFINDING_ALGORITHMS_MAP.get(algorithm);
  if(algo === undefined) throw new Error("Algorithm not found");
  return algo(graph, source, destination);
}


export {
    PATHFINDING_ALGORITHMS,
    pathfind,
}



