import {
    CELL,
    GridGraph,
    CELL_TRAVERSAL,
    Cell,
    DEFAULT_CELL_WEIGHT,
} from '../../dataStructures';

import {    
    pathfind,
    createMaze,
    PATHFINDING_ALGORITHMS,
} from '../../algorithms';

const GRID_TYPE = {
    EMPTY : "Empty",
    MAZE : "Maze",
};

const COORD_UNDEFINED = "COORD_UNDEFINED";
const COORD_OBJ_UNDEFINED = {x: -1, y: -1};

const createCoord = (x, y)  => `${x}:${y}`;
const tupleFromCoord = (coord) => coord.split(":").map((x) => parseInt(x));
const createCoordObj = (x, y) => ({x, y});
const createCoordFromObj = ({x, y}) => createCoord(x, y);


const coordObjFromCoord = (coord) => {
    if(coord === COORD_UNDEFINED) return COORD_OBJ_UNDEFINED;
    const [x, y] = tupleFromCoord(coord);
    return createCoordObj(x, y);
}

const adjacentCoords = (width, height, x, y) => {
    let coords = [];
    if(x < width - 1) 
        coords.push(createCoord(x + 1, y));
    if(y < height - 1) 
        coords.push(createCoord(x, y + 1));
    if(x > 0) 
        coords.push(createCoord(x - 1, y));
    if(y > 0) 
        coords.push(createCoord(x, y - 1));
    return coords;
}

const defaultSrcIndex = (width, height) => createCoordObj(Math.floor(width / 8), Math.floor(height / 2));                  //left x, center y
const defaultDestIndex = (width, height) => createCoordObj(width - 1 - Math.floor(width / 8), Math.floor(height / 2));         //right x, center y
const defaultConnectedAIndex = (width, height) => createCoordObj(Math.floor(width / 2), Math.floor(height / 8));     //center x, top y
const defaultConnectedBIndex = (width, height) => createCoordObj(Math.floor(width / 2), height - 1 - Math.floor(height / 8));    //center x, bottom y



class Grid {
    constructor(width, height, type) { 
        if(width < 1 || height < 1) throw new Error("Grid must be at least 1x1");
        this.cellsArray2D = [];
        this.uniqueIndexes = new Map();
        this.width = width;
        this.height = height;
        this.uniqueIndexes = new Map([
            [CELL.SRC, COORD_OBJ_UNDEFINED],
            [CELL.DEST, COORD_OBJ_UNDEFINED],
            [CELL.CONNECTED_A, COORD_OBJ_UNDEFINED],
            [CELL.CONNECTED_B, COORD_OBJ_UNDEFINED],
        ]);
        if(type === GRID_TYPE.EMPTY) this._setEmptyArray();
        else if(type === GRID_TYPE.MAZE) this._setMazeArray();
        this._setUniqueCells();
    }

    _setEmptyArray = () => {
        this.cellsArray2D = [];
        for(let y = 0; y < this.height; y++){
            const row = []
            for(let x = 0; x < this.width; x++){
                row.push(new Cell(CELL.NORMAL, CELL_TRAVERSAL.UNVISITED, DEFAULT_CELL_WEIGHT));
            }
            this.cellsArray2D.push(row);
        }
    }

    _setMazeArray = () => this.cellsArray2D = createMaze(this.width, this.height);
    
    _setUniqueCells = () => {
        const sourceIndex = this._emptyNeighbourCoord(defaultSrcIndex(this.width, this.height));
        const destIndex = this._emptyNeighbourCoord(defaultDestIndex(this.width, this.height));
        this.uniqueIndexes.set(CELL.SRC, sourceIndex);
        this.uniqueIndexes.set(CELL.DEST, destIndex);
        this.cellsArray2D[sourceIndex.y][sourceIndex.x] = new Cell(CELL.SRC, CELL_TRAVERSAL.UNVISITED, DEFAULT_CELL_WEIGHT);
        this.cellsArray2D[destIndex.y][destIndex.x] = new Cell(CELL.DEST, CELL_TRAVERSAL.UNVISITED, DEFAULT_CELL_WEIGHT);
    }

    getCell = (x, y) => {
        return this.cellsArray2D[y][x];
    }

    get matrix () {
        this.cellsArray2D = [...this.cellsArray2D];
        return this.cellsArray2D;
    }

    /*
        Runs the given algorithm with the grid as the graph and the source and destination cells as the start and end nodes.
        Returns an object with two sets: visited and path.
        The sets contain coordinate strings.
        The result can be used with updateCell and updateCellTraversal to update the grid 1 cell at a time.
    */
    runAlgorithm = (algorithm) => {
        const sourceCoord = createCoordFromObj(this.uniqueIndexes.get(CELL.SRC));
        const destCoord = createCoordFromObj(this.uniqueIndexes.get(CELL.DEST));
        const {visited, path} = pathfind(algorithm, this._createGraph(), sourceCoord, destCoord);
        return {visited, path};
    }
    
    /*
        Sets the traversal state of all cells to unvisited.
    */
    clearAnimation = () => {
        const rowsToUpdate = new Set();
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const updated = this._setCellTraversal(createCoordObj(x, y), CELL_TRAVERSAL.UNVISITED);
                if(updated) rowsToUpdate.add(y);
            }
        }
        this._updateRows(rowsToUpdate);
    }

    /*
        Runs the given algorithm and updates the grid to show the visited and path cells.
    */
    runAlgorithmAndUpdate = (algorithm) => {
        const {visited, path} = this.runAlgorithm(algorithm);
        const rowsToUpdate = new Set();
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const coord = createCoord(x, y);
                const traversalState = path.has(coord) ? CELL_TRAVERSAL.PATH : visited.has(coord) ? CELL_TRAVERSAL.VISITED : CELL_TRAVERSAL.UNVISITED;
                const updated = this._setCellTraversal(createCoordObj(x, y), traversalState);
                if(updated) rowsToUpdate.add(y);
            }
        }
        this._updateRows(rowsToUpdate);
    }

    /*
        UpdateCell, updateCellTraversal, removeConnectedCells and addConnectedCells are used to update the grid.
        Will create deep copies of cells and rows that are updated, so react components can detect changes.
        Returns true if the grid was updated, false otherwise.
        If true is returned the grid can be copied and passed to a state variable to rerender the grid.
    */
    updateCell = (x, y, cellType, weight) => {
        const currentCell = this.cellsArray2D[y][x];
        if (this.uniqueIndexes.has(currentCell.type) || 
            (currentCell.type === cellType && currentCell.weight === weight)
        ) return false;

        const newCoord = createCoordObj(x, y);

        if(this.uniqueIndexes.has(cellType)){
            this._setUniqueCell(newCoord, cellType);
        }
        else {
            this._setCell(newCoord, cellType, weight);
        }

        return true;
    }

    updateCellTraversal = (x, y, traversalState) => {
        const coordObj = createCoordObj(x, y);
        const updated = this._setCellTraversal(coordObj, traversalState);
        if(!updated) return false;
        this._updateRow(coordObj.y);
        return true;
    }

    removeConnectedCells  = () => {
        if(!this._hasConnectedCells()) return false;
        const a = this.uniqueIndexes.get(CELL.CONNECTED_A);
        const b = this.uniqueIndexes.get(CELL.CONNECTED_B);

        this._setCell(a, CELL.NORMAL, 1);
        this._setCell(b, CELL.NORMAL, 1);
        
        this.uniqueIndexes
            .set(CELL.CONNECTED_A, COORD_OBJ_UNDEFINED)
            .set(CELL.CONNECTED_B, COORD_OBJ_UNDEFINED);
        return true;
    }
    
    addConnectedCells  = () => {
        if(this._hasConnectedCells ()) return false;
        let a = defaultConnectedAIndex(this.width, this.height);
        let b = defaultConnectedBIndex(this.width, this.height);

        a = this._closestEmptyCoord(a);
        b = this._closestEmptyCoord(b);

        this._setCell(a, CELL.CONNECTED_A, 1);
        this._setCell(b, CELL.CONNECTED_B, 1);

        this.uniqueIndexes
            .set(CELL.CONNECTED_A, a)
            .set(CELL.CONNECTED_B, b);
        return true;
    }

    _createGraph = () => {
        const matrix = this.cellsArray2D.map(row => row.map(cell => cell.weight));
        const graph = new GridGraph(this.width, this.height, matrix); 
        if(this._hasConnectedCells()){
            const a = this.uniqueIndexes.get(CELL.CONNECTED_A);
            const b = this.uniqueIndexes.get(CELL.CONNECTED_B);
            graph.setConnectedCells(a, b);
        }
        return graph;
    }

    _emptyNeighbourCoord = (coord) => {
        if(this.cellsArray2D[coord.y][coord.x].type == CELL.NORMAL) 
            return coord;
        const neighbours = adjacentCoords(this.width, this.height, coord.x, coord.y).map(coord => coordObjFromCoord(coord));
        for(let neighbour of neighbours){
            if(this.cellsArray2D[neighbour.y][neighbour.x].type == CELL.NORMAL)
                return neighbour;
        }
        return coord;
    }

    _closestEmptyCoord = (coord) => {
        if(this.cellsArray2D[coord.y][coord.x].type == CELL.NORMAL) 
            return coord;

        const {visited} = pathfind(PATHFINDING_ALGORITHMS.BFS, new GridGraph(this.width, this.height), createCoordFromObj(coord), undefined);
        for(let coordString of visited){
            const coordObj = coordObjFromCoord(coordString);
            if(this.cellsArray2D[coordObj.y][coordObj.x].type == CELL.NORMAL)
                return coordObj;
        }
        return coord;
    }
    
    _hasConnectedCells = () => this.uniqueIndexes.get(CELL.CONNECTED_A) !== COORD_OBJ_UNDEFINED;


    /*
        _updateRow, _updateRows, _setCell, _setCellTraversal, _setUniqueCell are update the grid and create deep copies of the updated cells and rows.
    */
    _updateRow = (row) => this.cellsArray2D[row] = [...this.cellsArray2D[row]];
    _updateRows = (rows) => rows.forEach(row => this._updateRow(row));

    _setCell = (coordObj, cellType, weight) => {
        this.cellsArray2D[coordObj.y][coordObj.x] = new Cell(cellType, CELL_TRAVERSAL.UNVISITED, weight);
        this._updateRow(coordObj.y);
    }

    _setCellTraversal = (coordObj, traversalState) => {
        const cell = this.cellsArray2D[coordObj.y][coordObj.x];
        if(cell.traversalState === traversalState) return false;
        this.cellsArray2D[coordObj.y][coordObj.x] = new Cell(cell.type, traversalState, cell.weight);
        return true;    
    }

    _setUniqueCell = (coordObj, cellType) => {
        const oldCoord = this.uniqueIndexes.get(cellType); 
        this._setCell(oldCoord, CELL.NORMAL, 1);
        this.uniqueIndexes.set(cellType, coordObj);
        this._setCell(coordObj, cellType, 1);
    }
}

export {
    createCoord,
    tupleFromCoord,
    COORD_UNDEFINED,
    createCoordObj,
    createCoordFromObj,
    coordObjFromCoord,
    COORD_OBJ_UNDEFINED,
    adjacentCoords,
    Grid,
    GRID_TYPE,
};