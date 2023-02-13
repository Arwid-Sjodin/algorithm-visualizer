import React from 'react';
import './Button.css';

const ButtonToggle = React.memo(
    ({enabled, active, setActive, inactiveText, activeText}) => {
        const cssClass = 
            !enabled ? "disabled" : 
            active ? "selected-div" : "";
        return (
            <button
                className={`clickable clickable-div button ${cssClass}`}
                onClick={() => setActive(!active)}
                disabled={!enabled}
            >   
            <a className="button-text">
                {active ? activeText : inactiveText}
            </a>
            </button>
        );
    }, 
    (prevProps, nextProps) => {
        return prevProps.enabled === nextProps.enabled && 
        prevProps.active === nextProps.active &&
        prevProps.setActive === nextProps.setActive;
    }
);

export default ButtonToggle;