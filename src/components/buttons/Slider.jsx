import React from 'react';
import './Button.css';

const Slider = React.memo(
    ({enabled, label, value, setValue, min, max, minValue, maxValue, oddOnly}) => {
        const sliderSetValue = (newValue) => {
            if (newValue === min) {
                setValue(minValue);
            } else if (newValue === max) {
                setValue(maxValue);
            } else {
                if(!oddOnly || newValue % 2 === 1){
                    setValue(newValue);
                }
            }
        }

        const sliderValue = 
        value === minValue ? min : 
        value === maxValue ? max : 
        value;

        const width = (sliderValue-min)*100/(max-min);
        const disabledClassName = enabled ? "" : "disabled";
        
        return (
            <button
                disabled={!enabled}
                className={`standard-button-container button-container clickable-div ${disabledClassName}`}
            >
                <div className={`slider-container`}>

                    <div className="left-side selected-div" style={{width: `${width}%`}}/>

                    <a className="button-text slider-label">{label}</a>
                    <input
                        className="slider clickable"
                        id = "myRange"
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={e => sliderSetValue(e.target.valueAsNumber)}
                    />
                </div>
            </button>
        );
    }, 
    (prevProps, nextProps) => {
        return prevProps.value === nextProps.value && prevProps.enabled === nextProps.enabled;
    }
);

export default Slider;