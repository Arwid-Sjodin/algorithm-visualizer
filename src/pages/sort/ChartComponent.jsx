import React from "react";
import { SORT_OPERATION_TYPES } from "../../algorithms";
import "./ChartComponent.css";

const Bar = React.memo(({value, sortState}) => {
        return (<div className={`bar sortState-${sortState}`} style={{height: `${value}%`}}/>);
    },(prevProps, nextProps) => {     
        return prevProps.value === nextProps.value &&
        prevProps.sortState === nextProps.sortState;
    }
);

const ChartComponent = React.memo( ({array, renderArrayInfo}) => { 
        const {accessedIndexes, operationType, finalIndexes} = renderArrayInfo;
        const sortState = (idx) => {
            return finalIndexes.has(idx) ? SORT_OPERATION_TYPES.FINAL : 
            accessedIndexes.has(idx) ? operationType : 
            SORT_OPERATION_TYPES.NONE;
        };

        const cssClass = array.length > 100 ? "large-array" : "";

        const gridStyle = {
            display: "grid",
            gridGap: `1px`,
            gridTemplateColumns: `repeat(${array.length}, minmax(1px, 1fr))`,
            gridTemplateRows: `repeat(1, minmax(40px, 1fr))`,
        };

        return (
            <div className={`chart ${cssClass}`} style={gridStyle}>
                {array.map((value, idx) => (
                    <Bar
                        key={idx}
                        value={value}
                        sortState = {sortState(idx)}
                    />
                ))}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.array === nextProps.array &&
            prevProps.renderArrayInfo === nextProps.renderArrayInfo;
    }
);

export default ChartComponent;