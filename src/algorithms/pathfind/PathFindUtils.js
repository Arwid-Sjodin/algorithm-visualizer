class SEARCH_RESULT{
    constructor(foundPath, visited, iterations, path) {
        this.foundPath = foundPath;
        this.visited = visited;
        this.iterations = iterations;
        this.path = new Set(path);
    }
}

class SearchEntry {
  constructor(vertex, edgeToHere, previousEntry) {
    this.vertex = vertex;
    this.edgeToHere = edgeToHere;
    this.previousEntry = previousEntry;
  }
}

function computePath(current) {
  let path = [];
  while(current !== null) {
      path.push(current.vertex);
      current = current.previousEntry;
  }
  return path.reverse();
}

export {
    SearchEntry,
    computePath,
    SEARCH_RESULT,
}