import React, {useCallback, useEffect, useRef, useState} from 'react';
import { 
    randomShuffledArray,
    randomAscendingArray,
    randomDescendingArray,
    randomRealisticArray,
    getValue,
} from "../../utils";
import {
    SORT_ALGORITHMS,
    sort,
    applyOperation,
    } from "../../algorithms";
import '../Page.css'
import ChartComponent from './ChartComponent';
import { 
    ButtonToggle, 
    ButtonStandard, 
    ButtonDropdown,
    Slider,
} from '../../components';

const ARRAY_TYPE = {
    SHUFFLED: "Shuffled",
    ASCENDING : "Ascending",
    DESCENDING : "Descending",
    REALISTIC : "Realistic",
}

const ARRAY_TYPE_OPTIONS = Object.values(ARRAY_TYPE);
const SORT_ALGORITHM_OPTIONS = Object.values(SORT_ALGORITHMS);


const DEFAULT_ANIMATION_SPEED = 95;
const MIN_ANIMATION_SPEED = 0;
const MAX_ANIMATION_SPEED = 100;
const DEFAULT_ARRAY_LENGTH = 100;
const MAX_ARRAY_LENGTH = 150;
const MIN_ARRAY_LENGTH = 10;
const MAX_DELAY = 500;

const randomArray = (length, type) => {
    switch(type){
        case ARRAY_TYPE.ASCENDING:
            return randomAscendingArray(length);
        case ARRAY_TYPE.DESCENDING:
            return randomDescendingArray(length);
        case ARRAY_TYPE.REALISTIC:
            return randomRealisticArray(length);
        default:
            return randomShuffledArray(length);
    }
}

class RenderArrayInfo {
    constructor(operationType, accessedIndexes, finalIndexes){
        this.operationType = operationType;
        this.accessedIndexes = accessedIndexes;
        this.finalIndexes = finalIndexes;
    }

    static newInstance() {
        return new RenderArrayInfo(undefined, new Set(), new Set());
    }
}

const Sort = () => {
    const [renderArrayInfo, setRenderArrayInfo] = useState(RenderArrayInfo.newInstance());

    const [selectedAlgorithm, setSelectedAlgorithm] = useState(undefined);
    const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_ANIMATION_SPEED);
    const [animating, setAnimating] = useState(false);

    const array = useRef(undefined);
    const [arrayLength, setArrayLength] = useState(DEFAULT_ARRAY_LENGTH);
    const [arrayType, setArrayType] = useState(ARRAY_TYPE.SHUFFLED);
    const previousArray = useRef(undefined);

    const animationID = useRef(undefined);
    const animationDelay = useRef(undefined);

    if(array.current === undefined){
        array.current = randomArray(arrayLength, arrayType);
        animationDelay.current = getValue(animationSpeed/100, MAX_DELAY);
    }
    
    const clearAnimationTimeout = () => {
        clearTimeout(animationID.current);
        animationID.current = undefined;
    }

    const animate = (operations) => {
        const operation = operations.pop();
        if(operation === undefined){
            clearAnimationTimeout();
            return;
        }
        setRenderArrayInfo((prevRenderArrayInfo) => {
            const result = applyOperation(array.current, operation);//Modifies the array and returns information about what was modified
            result.finalIndexes.forEach((index) => {
                prevRenderArrayInfo.finalIndexes.add(index);
            });
            return new RenderArrayInfo(
                result.operationType, 
                new Set(result.accessedIndexes), 
                prevRenderArrayInfo.finalIndexes,
            );
        });
        if(animating){
            animationID.current = setTimeout(() => {
                animate(operations);
            }, animationDelay.current);
        } 
    }

    const startAnimation = () => { 
        previousArray.current = [...array.current];
        const { operations } = sort(selectedAlgorithm, array.current); //Does not modify the array
        animate(operations.reverse());      
    }

    const stopAnimation = () => {
        clearAnimationTimeout();
        setRenderArrayInfo(() => {
            if(previousArray.current !== undefined){
                array.current = previousArray.current;
                previousArray.current = undefined;
            } else{
                array.current = randomArray(arrayLength, arrayType);
            }
            return RenderArrayInfo.newInstance();
        });
    }

    const resetArray = useCallback(() => {
        if(animating){
            previousArray.current = undefined;
            setAnimating(false);
            return;
        }
        setRenderArrayInfo(() => {
            array.current = randomArray(arrayLength, arrayType);
            return RenderArrayInfo.newInstance();
        });
    }, [animating, arrayLength, arrayType]);


    const setSelectedAlgorithmHandle = useCallback((value) => {
        setAnimating(false);
        setSelectedAlgorithm(value);
    }, []);

    const setAnimationSpeedHandle = useCallback((value) => {
        animationDelay.current = getValue(value/100, MAX_DELAY);
        setAnimationSpeed(value);
    }, []);

    useEffect (() => {
        resetArray();
    }, [arrayLength, arrayType]);

    useEffect(() => {
        if(animating) startAnimation();
        else stopAnimation();
    }, [animating]);

    return (
        <div className="page-container">
            <div className="buttons-grid">
                <ButtonDropdown 
                    options = {ARRAY_TYPE_OPTIONS}
                    label = "Set Array"
                    value = {arrayType}
                    setValue = {setArrayType}
                />
                <ButtonStandard
                    enabled = {true}
                    onClick = {resetArray}
                    text = "Reset"
                />
                <Slider
                    enabled = {true}
                    label = "Size"
                    min = {MIN_ARRAY_LENGTH}
                    minValue = {MIN_ARRAY_LENGTH}
                    max = {MAX_ARRAY_LENGTH}
                    maxValue = {MAX_ARRAY_LENGTH}
                    value = {arrayLength}
                    setValue = {setArrayLength}
                    oddOnly = {false}
                />
                <Slider
                    enabled = {true}
                    label = "Speed"
                    min = {MIN_ANIMATION_SPEED}
                    minValue = {MIN_ANIMATION_SPEED}
                    max = {MAX_ANIMATION_SPEED}
                    maxValue = {MAX_ANIMATION_SPEED}
                    value = {animationSpeed}
                    setValue = {setAnimationSpeedHandle}
                    oddOnly = {false}
                />
                <ButtonDropdown 
                    options = {SORT_ALGORITHM_OPTIONS}
                    label = "Select Algorithm"
                    value = {selectedAlgorithm}
                    setValue = {setSelectedAlgorithmHandle}
                />
                <ButtonToggle
                    enabled = {selectedAlgorithm !== SORT_ALGORITHMS.UNDEFINED}
                    active = {animating}
                    setActive = {setAnimating}
                    inactiveText = "Start"
                    activeText = "Stop"
                />
            </div>
            <ChartComponent 
                array = {array.current}
                renderArrayInfo = {renderArrayInfo}
            />
        </div>
    );
}

export default Sort;