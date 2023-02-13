

const CELL = {
    REMOVED : "REMOVED",
    NORMAL : "NORMAL",
    UNDEFINED : "UNDEFINED",
    SRC: "SRC",
    DEST: "DEST",
    CONNECTED_A: "CONNECTED_A",
    CONNECTED_B: "CONNECTED_B",
};

const CELL_TRAVERSAL = {
    UNVISITED : "UNVISITED",
    VISITED: "VISITED",
    PATH: "PATH",
};

class Cell {
    constructor(type, traversalState, weight){ 
        this.type = type;
        this.traversalState = traversalState;
        this.weight = weight;
    }
}

const DEFAULT_CELL_WEIGHT = 1;
const REMOVED_CELL_WEIGHT = Infinity;

export {
    CELL,
    CELL_TRAVERSAL,
    Cell,
    DEFAULT_CELL_WEIGHT,
    REMOVED_CELL_WEIGHT,
};