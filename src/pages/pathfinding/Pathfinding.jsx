import React, { useState, useEffect, useRef, useCallback} from 'react';
import '../Page.css'
import {
    GridComponent,
}from './GridComponent';
import { 
    Grid, 
    CELL, 
    CELL_TRAVERSAL, 
    COORD_UNDEFINED,
    tupleFromCoord,
    DEFAULT_CELL_WEIGHT,
    REMOVED_CELL_WEIGHT,
    GRID_TYPE,
} from "../../dataStructures";
import {
    PATHFINDING_ALGORITHMS,
} from "../../algorithms";
import {
    getValue,
} from "../../utils";
import { 
    ButtonDropdown,
    ButtonStandard,
    ButtonToggle,
    Slider,
} from '../../components';

const CELL_PLACEMENT = {
    RESET : "Reset Cell",
    WEIGHT : "Place Weight",
    REMOVE : "Remove Cell",
};

const ALROITHM_OPTIONS = Object.values(PATHFINDING_ALGORITHMS);
const GRID_TYPE_OPTIONS = Object.values(GRID_TYPE);
const CELL_PLACEMENT_OPTIONS = Object.values(CELL_PLACEMENT);

const DEFAULT_WEIGHT = 3;
const MIN_WEIGHT = 2;
const MAX_WEIGHT = 9;

const DEFAULT_GRID_HEIGHT = 21;//Odd for better looking maze generation
const MIN_GRID_HEIGHT = 5;  
const MAX_GRID_HEIGHT = 45;
const DEFAULT_GRID_WIDTH = 65;
const MIN_GRID_WIDTH = 5;
const MAX_GRID_WIDTH = 75;

const DEFAULT_ANIMATION_SPEED = 95;
const MIN_ANIMATION_SPEED = 0;
const MAX_ANIMATION_SPEED = 100;
const MAX_DELAY = 500;

const Pathfinding = () => {

    const [gridHeight, setGridHeight] = useState(DEFAULT_GRID_HEIGHT);
    const [gridWidth, setGridWidth] = useState(DEFAULT_GRID_WIDTH);
    const [gridType, setGridType] = useState(GRID_TYPE.EMPTY);
    const [connectedCellsActive, setConnectedCellsActive] = useState(false);

    const [cellWeight, setCellWeight] = useState(DEFAULT_WEIGHT);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(PATHFINDING_ALGORITHMS.UNDEFINED);
    const [selectedCellPlacement, setSelectedCellPlacement] = useState(CELL_PLACEMENT.REMOVE);
    
    const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
    const [animating, setAnimating] = useState(false);

    const [hoverCoord, setHoverCoord] = useState(COORD_UNDEFINED);

    const previousCell = useRef(undefined);
    const hoverCell = useRef(undefined);
    const [mouseDown, setMouseDown] = useState(false);
    const animationDelay = useRef(getValue(animationSpeed/100, MAX_DELAY));
    const animationID = useRef(undefined);

    const gridRef = useRef(undefined);

    const grid = () => {
        if(gridRef.current === undefined) {
            gridRef.current = new Grid(gridWidth, gridHeight, GRID_TYPE.EMPTY);
        }
        return gridRef.current;
    }

    const [matrix, setMatrix] = useState(grid().matrix);
    

    useEffect(() => {
        const mouseUpHandle = () => setMouseDown(false);
        const mouseDownHandle = () => setMouseDown(true);
        document.addEventListener('mousedown', mouseDownHandle, true);
        document.addEventListener('mouseup', mouseUpHandle, true);
        return () => {
          document.removeEventListener('mousedown', mouseDownHandle, true);
          document.removeEventListener('mouseup', mouseUpHandle, true);
        };
    }, [])

    const setSelectedAlgorithmHandle = useCallback((value) => {
        setAnimating(false);
        setSelectedAlgorithm(value);
    }, []);


    const updateMatrix = (isNeeded) => {if(isNeeded) setMatrix(grid().matrix);}

    const dropUniqueCell = () => {
        hoverCell.current = undefined;
        previousCell.current = undefined;
    }

    const clearAnimationTimeout = () => {
        clearInterval(animationID.current);
        animationID.current = undefined;
    }

    const clearAnimationAndSetMatrix = () => {
        if(animating){
            clearAnimationTimeout();
            grid().clearAnimation();
            setAnimating(false);
        }
        setMatrix(grid().matrix);
    };

    const resetGrid = useCallback(() => {
        setAnimating(false);
        gridRef.current = new Grid(gridWidth, gridHeight, gridType);
        setMatrix(grid().matrix);
        setConnectedCellsActive(false);
    }, [gridHeight, gridWidth, gridType]);

    const setSpeedHandle = useCallback((value) => {
        animationDelay.current = getValue(value/100, MAX_DELAY);
        setAnimationSpeed(value);
    }, []);

    const mouseClickCellHandle = () => {
        const [x, y] = tupleFromCoord(hoverCoord);
        let needReRender = false;
        if(hoverCell.current === undefined){
            setAnimating(false);
            let type;
            let weight;
            switch(selectedCellPlacement){
                case CELL_PLACEMENT.WEIGHT:
                    type = CELL.NORMAL;
                    weight = cellWeight;
                    break;
                case CELL_PLACEMENT.REMOVE:
                    type = CELL.REMOVED;
                    weight = REMOVED_CELL_WEIGHT;
                    break;
                case CELL_PLACEMENT.RESET:
                    type = CELL.NORMAL;
                    weight = DEFAULT_CELL_WEIGHT;
                    break;
                default:
                    throw new Error("Invalid cell placement");
            }
            needReRender = grid().updateCell(x, y, type, weight);
        }
        else{
            const prev = previousCell.current;
            previousCell.current = {x, y, cell : grid().getCell(x, y)}
            needReRender = grid().updateCell(x, y, hoverCell.current, DEFAULT_CELL_WEIGHT);
            if(prev !== undefined){
                needReRender = grid().updateCell(prev.x, prev.y, prev.cell.type, prev.cell.weight) || needReRender;
            }
            if(animating){
                clearInterval(animationID.current);
                animationID.current = undefined;
                grid().runAlgorithmAndUpdate(selectedAlgorithm);
                needReRender = true;
            }
        }
        updateMatrix(needReRender);
    }

    const mouseDownHandle = () => {
        if(hoverCoord === COORD_UNDEFINED){
            return;
        }

        const [x, y] = tupleFromCoord(hoverCoord);
        const cell = grid().getCell(x, y);
        switch(cell.type){
            case CELL.SRC:
            case CELL.DEST:
            case CELL.CONNECTED_A:
            case CELL.CONNECTED_B:
                hoverCell.current = cell.type;
                break;
            default:
                break;
        }
        if(hoverCoord !== COORD_UNDEFINED){
            mouseClickCellHandle()
        }
    }
        
    const setAnimationTimeout = (animationMethod) => {
        animationID.current = setTimeout(() => {
            animationMethod();
        }, animationDelay.current);
    }

    const animatePath = (array) => {
        if(array.length === 0){
            clearAnimationTimeout();
            return;
        }
        const [x, y]= tupleFromCoord(array.pop());
        updateMatrix(grid().updateCellTraversal(x, y, CELL_TRAVERSAL.PATH));
        if(animating) setAnimationTimeout(() => animatePath(array));
    }

    const animate = (visitedArray, pathArray) => {
        if(visitedArray.length === 0){
            setAnimationTimeout(() => animatePath(pathArray));
            return;
        }
        const [x, y]= tupleFromCoord(visitedArray.pop());
        updateMatrix(grid().updateCellTraversal(x, y, CELL_TRAVERSAL.VISITED));
        if(animating){
            setAnimationTimeout(() => animate(visitedArray, pathArray));
        }
    }

    const animateStartHandle = () => {
        const {visited, path} = grid().runAlgorithm(selectedAlgorithm);
        setAnimationTimeout(() => animate([...visited].reverse(), [...path].reverse()));
    }

    const animateStopHandle = () => {
        clearAnimationTimeout();
        grid().clearAnimation();
        setMatrix(grid().matrix);
    }

    useEffect(() => {
        if(hoverCoord === COORD_UNDEFINED){
            dropUniqueCell();
        }
        else if(mouseDown) mouseClickCellHandle();
    }, [hoverCoord])

    useEffect(() => {
        if(mouseDown) mouseDownHandle();
        else dropUniqueCell();
    }, [mouseDown])

    useEffect(() => {
        resetGrid();
    }, [gridType, gridWidth, gridHeight])

    useEffect(() => {
        if(connectedCellsActive) grid().addConnectedCells();
        else grid().removeConnectedCells();
        clearAnimationAndSetMatrix();
    }, [connectedCellsActive]);

    useEffect(() => {
        if(animating) animateStartHandle();
        else animateStopHandle();
    }, [animating])

    return (
        <div className="page-container">
            <div className="buttons-grid">
                    <ButtonDropdown 
                        options = {GRID_TYPE_OPTIONS}
                        label = "Set Grid"
                        value = {gridType}
                        setValue = {setGridType}
                    />
                    <ButtonStandard
                        enabled = {true}
                        onClick = {resetGrid}
                        text = "Reset"
                    />
                    <Slider
                        enabled = {true}
                        label = "Width"
                        min = {MIN_GRID_WIDTH}
                        minValue = {MIN_GRID_WIDTH}
                        max = {MAX_GRID_WIDTH}
                        maxValue = {MAX_GRID_WIDTH}
                        value = {gridWidth}
                        setValue = {setGridWidth}
                        oddOnly = {true}
                    />
                    <Slider
                        enabled = {true}
                        label = "Height"
                        min = {MIN_GRID_HEIGHT}
                        minValue = {MIN_GRID_HEIGHT}
                        max = {MAX_GRID_HEIGHT}
                        maxValue = {MAX_GRID_HEIGHT}
                        value = {gridHeight}
                        setValue = {setGridHeight}
                        oddOnly = {true}
                    />
                    <ButtonDropdown 
                        options = {CELL_PLACEMENT_OPTIONS}
                        label = ""
                        value = {selectedCellPlacement}
                        setValue = {setSelectedCellPlacement}
                    />
                    <Slider
                        enabled = {selectedCellPlacement === CELL_PLACEMENT.WEIGHT}
                        label = "Weight"
                        min = {MIN_WEIGHT}
                        minValue = {MIN_WEIGHT}
                        max = {MAX_WEIGHT}
                        maxValue = {MAX_WEIGHT}
                        value = {cellWeight}
                        setValue = {setCellWeight}
                    />
                    <ButtonToggle
                        enabled = {true}
                        active = {connectedCellsActive}
                        setActive = {setConnectedCellsActive}
                        inactiveText = "Connected Cells"
                        activeText = "Connected Cells"
                    />
                    <Slider
                        enabled = {true}
                        label = "Speed"
                        min = {MIN_ANIMATION_SPEED}
                        minValue = {MIN_ANIMATION_SPEED}
                        max = {MAX_ANIMATION_SPEED}
                        maxValue = {MAX_ANIMATION_SPEED}
                        value = {animationSpeed}
                        setValue = {setSpeedHandle}
                        oddOnly = {false}
                    />
                    <ButtonDropdown 
                        options = {ALROITHM_OPTIONS}
                        label = "Select Algorithm"
                        value = {selectedAlgorithm}
                        setValue = {setSelectedAlgorithmHandle}
                    />
                    <ButtonToggle
                        enabled = {selectedAlgorithm !== PATHFINDING_ALGORITHMS.UNDEFINED}
                        active = {animating}
                        setActive = {setAnimating}
                        inactiveText = "Start"
                        activeText = "Stop"
                    />
            </div>

            <GridComponent
                matrix = {matrix}
                mouseHoverHandler = {setHoverCoord}
            />
        </div>
    );
}

export default Pathfinding;