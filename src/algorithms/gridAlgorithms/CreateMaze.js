import {
    tupleFromCoord,
    createCoord,
    CELL,
    Cell,
    CELL_TRAVERSAL,
    DEFAULT_CELL_WEIGHT,
    REMOVED_CELL_WEIGHT,
} from '../../dataStructures'; 

class CoordEdge {
    constructor(start, edge, end) {
        this.start = start;
        this.edge = edge;
        this.end = end;
    }
}

const createCoordEdges = (aX, aY, bX, bY) => {
    const A = createCoord(aX, aY);
    const B = createCoord(bX, bY);
    const edge = createCoord((aX + bX) / 2, (aY + bY) / 2);
    return {AtoB: new CoordEdge(A, edge, B), BtoA: new CoordEdge(B, edge, A)};
}

/**
 * Create a graph representation of a grid where cells are either vertices or edges.
 * Cell are vertices if they are parity-matched with the starting cell and edges if they are not.
 * Returns a map from cell-vertex to an array of cell-edges.
 * @param {number} width
 * @param {number} height
 * @returns {Map<coord, Array<CoordEdge>}
 */
const createParityMatchedGraph = (width, height, startCoord) => {
    const graph = new Map();

    const [startX, startY] = tupleFromCoord(startCoord);

    const lowestWithSameParity = (x) => x % 2 === 0 ? 0 : 1;
    
    const [vertexStartX, vertexStartY] = [lowestWithSameParity(startX), lowestWithSameParity(startY)];

    const setCoord = (coord, edges) => {
        if(graph.has(coord)) {
            graph.get(coord).push(...edges);
        } else {
            graph.set(coord, edges);
        }
    }

    const setCoords = (x, y, x2, y2) => {
        const {AtoB, BtoA} = createCoordEdges(x, y, x2, y2);
        setCoord(AtoB.start, [AtoB]);
        setCoord(BtoA.start, [BtoA]);
    }

    //Add first column except for the one at the top that is also a part of the first row.
    //For each vertex, add an edge to the one above.
    for (let y = vertexStartY + 2; y < height; y += 2) {
        setCoords(vertexStartX, y, vertexStartX, y-2);
    }


    //Add first row except for the one at the left that is also a part of the first column.
    //For each vertex, add an edge to the one to the left.
    for (let x = vertexStartX + 2; x < width; x += 2) {
        setCoords(x, vertexStartY, x-2, vertexStartY);
    }

    //Add all other vertices. 
    //For each vertex, add an edge to the one above and to the one to the left.
    for (let y = vertexStartY + 2; y < height; y += 2) {
        for (let x = vertexStartX + 2; x < width; x += 2) {
            setCoords(x, y, x, y-2);
            setCoords(x, y, x-2, y);
        }
    }

    return graph;
};

const convertTo2DArray = (width, height, visitedCells, usedEdges) => {
    const getCell = (coord) => {
        if(visitedCells.has(coord) || usedEdges.has(coord)){
            return new Cell(CELL.NORMAL, CELL_TRAVERSAL.UNVISITED, DEFAULT_CELL_WEIGHT);
        }
        return new Cell(CELL.REMOVED, CELL_TRAVERSAL.UNVISITED, REMOVED_CELL_WEIGHT);
    }

    const cells = [];
    for(let y = 0; y < height; y++) {
        const row = [];
        for(let x = 0; x < width; x++) {
            const coord = createCoord(x, y);
            row.push(getCell(coord));
        }
        cells.push(row);
    }
    return cells;
}

//Used for loop-erasing random walk for Wilson's Algorithm.
class LoopErasingPath {
    constructor(){
        this._edgesStack = [];
        this._cellsSet = new Set();
        this._cellsStack = [];
    }

    init = (startCoord) => {
        this._edgesStack = [];
        this._cellsSet = new Set([startCoord]);
        this._cellsStack = [startCoord];
    }

    has = (coord) => this._cellsSet.has(coord);

    peek = () => this._cellsStack[this._cellsStack.length - 1];

    visit = (coord, edge) => {
        this._cellsSet.add(coord);
        this._cellsStack.push(coord);
        this._edgesStack.push(edge);
    }

    eraseLoop = (coord) => {
        while(this.peek() !== coord) {
            let current = this._cellsStack.pop();
            this._edgesStack.pop();
            this._cellsSet.delete(current);
        }
    }

    addToMaze = (visitedCells, usedEdges) =>  {
        this._cellsStack.forEach(cell => visitedCells.add(cell));
        this._edgesStack.forEach(edge => usedEdges.add(edge.edge));
    }
}

/** 
 * Creates a maze using Wilson's Algorithm. 
 * Takes the width, height of the grid.
 * Returns 2D array representation of a grid.
 * @param {number} width
 * @param {number} height
 * @returns {Array<Array<Cell>>}
 * 
*/
const createMaze = (width, height) => {

    //Start position (1, 1) and odd width and height ensure walls on all sides.
    //(0, 0) walls on no sides.
    const startCoord = createCoord(0, 0);  

    const mazeGraph = createParityMatchedGraph(width, height, startCoord);
    const cellCount = mazeGraph.size;
    const visitedCells = new Set();
    const usedEdges = new Set();

    const randomCoordNotVisited = () => {
        const keys = Array.from(mazeGraph.keys());
        const randomIndex = () => Math.floor(Math.random() * keys.length);
        let randomCoord = keys[randomIndex()];
        while(visitedCells.has(randomCoord)) {
            randomCoord = keys[randomIndex()];
        }
        return randomCoord;
    }

    const randomEdgeToNext = (coord) => {
        const edges = mazeGraph.get(coord);
        return edges[Math.floor(Math.random() * edges.length)];
    }

    visitedCells.add(startCoord);
    const path = new LoopErasingPath();
    while(visitedCells.size < cellCount) {

        let pathStartCoord = randomCoordNotVisited();
        path.init(pathStartCoord);

        while(true) {
            const current = path.peek();
            const edge = randomEdgeToNext(current);
            const next = edge.end;
            if(path.has(next)) path.eraseLoop(next);
            else path.visit(next, edge);
            if(visitedCells.has(next)) break;
        }

        path.addToMaze(visitedCells, usedEdges);
    }

    return convertTo2DArray(width, height, visitedCells, usedEdges);
}

export default createMaze;