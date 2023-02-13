import {     
    PATHFINDING_ALGORITHMS,
    pathfind,
} from '../src/algorithms';

import {
    GridGraph,
    createCoord,

} from '../src/dataStructures';

import {
    createRandomIntArray,
} from '../src/utils';

describe('pathfind', () => {
    it('should export PATHFINDING_ALGORITHMS', () => {
        expect(PATHFINDING_ALGORITHMS).toBeDefined();
    });
    it('should export pathfind', () => {
        expect(pathfind).toBeDefined();
    });
});

//Assume dijsktra works
//Test that AStar return a path equally as short as dijsktra


const randomWeightedGridGraph = (width, height) => {
    const lowestWeight = 0;
    const highestWeight = 100;
    const weightMatrix = [];
    for(let i = 0; i < height; i++){
        const row = createRandomIntArray(width, lowestWeight, highestWeight);
        weightMatrix.push(row);
    }
    const grid = new GridGraph(width, height, weightMatrix);
    const start = createCoord(0, 0);
    const end = createCoord(width - 1, height - 1);
    return {grid, start, end};
};


const testAStar = (width, height) => {
    it(`should return a path equally as short as dijsktra for a ${width}x${height} grid`, () => {
    for(let i = 0; i < 2; i++){
        const {grid, start, end} = randomWeightedGridGraph(width, height);
        const dijsktraResult = pathfind(PATHFINDING_ALGORITHMS.DIJKSTRA, grid, start, end);
        if(!dijsktraResult.foundPath) continue;
        const aStarResult = pathfind(PATHFINDING_ALGORITHMS.ASTAR, grid, start, end);
        expect(aStarResult.path.length).toEqual(dijsktraResult.path.length);
    }
    });
};


describe('AStar', () => {
    for(let width = 5; width <= 100; width++){
        testAStar(width, 50);
    }
});

