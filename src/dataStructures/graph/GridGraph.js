import { Graph, Edge } from './Graph';
import {
    createCoord,
    tupleFromCoord,
    DEFAULT_CELL_WEIGHT,
    REMOVED_CELL_WEIGHT,
    createCoordFromObj,
    adjacentCoords,
} from '../../dataStructures';

class GridGraph extends Graph {
    constructor(width, height, matrix=undefined) {    
        super();
        let getWeight = (x, y) => matrix[y][x];

        if(matrix===undefined){
            getWeight = (x, y) => DEFAULT_CELL_WEIGHT;
        }
        else if(matrix.length !== height || matrix[0].length !== width) {
            throw new Error("Weight matrix does not match grid dimensions");
        }
        this.height = height;
        this.width = width;
        
        for(let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.setCoord(x, y, getWeight(x, y));
            }
        }
    }
  
    costEstimate = (start, end) => {
        const [x, y] = tupleFromCoord(start);
        const [x2, y2] = tupleFromCoord(end);
        return Math.abs(x - x2) + Math.abs(y - y2);
    }

    setCoord(x, y, weight) {
        if(weight === REMOVED_CELL_WEIGHT) return;
        const adjCoords = adjacentCoords(this.width, this.height, x, y);
        const coord = createCoord(x, y);
        adjCoords.forEach(adjCoord => {
            this.addEdge(new Edge(adjCoord, coord, weight));
        });
    }

    setConnectedCells = (A, B) => {
        const a = createCoordFromObj(A);
        const b = createCoordFromObj(B);
        this.addEdge(new Edge(a, b, 0));
        this.addEdge(new Edge(b, a, 0));
    }
}

export {
    GridGraph,
};