class Edge {
    constructor(start, end, weight = 1) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }
}

class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    reset = () => {
        this.adjacencyList = new Map();
    }

    hasVertex = (vertex) => {
        return this.adjacencyList.has(vertex);
    }

    addVertex = (vertex) => {
        if(!this.hasVertex(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge = (edge) => {
        if(!this.hasVertex(edge.start)) {
            this.addVertex(edge.start);
        }
        if(!this.hasVertex(edge.end)) {
            this.addVertex(edge.end);
        }
        this.outgoingEdges(edge.start).push(edge);
    }

    removeEdge = (edge) => {
        let edges = this.outgoingEdges(edge.start);
        this.adjacencyList.set(edge.start, edges.filter(e => e !== edge));
    }

    
    get vertices() {
        return [...this.adjacencyList.keys()];
    }

    outgoingEdges = (vertex) => {
        return this.adjacencyList.get(vertex);
    }

    getEdges = (start, end) => {
        return this.outgoingEdges(start).filter(edge => edge.end === end);
    }

    numVertices = () => {
        return this.vertices().length;
    }

    numEdges = () => {
        let numEdges = 0;
        for(let vertex of this.vertices()) {
            numEdges += this.outgoingEdges(vertex).length;
        }
        return numEdges;
    }

    getNeighbors = (vertex) => {
        return this.outgoingEdges(vertex).map(edge => edge.end);
    }

    //A heuristic function that estimates the cost of the cheapest path from start to end.
    //Children graph classes should override this function if they have a better heuristic.
    costEstimate = (start, end) => {
        return 0;
    }

    removeAllEdges = () => {
        const vertices = this.vertices;
        this.adjacencyList = new Map();
        for(let vertex of vertices) {
            this.addVertex(vertex);
        }
    }
}

export {
    Edge, 
    Graph, 
};