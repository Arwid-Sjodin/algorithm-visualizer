import React from 'react';
import './GridComponent.css';
import { createCoord, COORD_UNDEFINED, CELL } from '../../dataStructures';

const InnerCellComponent = React.memo(({type, weight}) => {
    let hasWeight = type === CELL.NORMAL && weight > 1;
    return (<div className={`inner-cell ${type}`}>{hasWeight && weight}</div>);   
}, (prevProps, nextProps) => {
    return prevProps.type === nextProps.type 
    && prevProps.weight === nextProps.weight;
});

//Parent/Ancestor component need to create a new cell reference to trigger a re-render.
const CellComponent = React.memo(({coord, cell, mouseHoverHandler}) => {
    return (
      <div
        draggable="false"
        id={coord}
        className={`grid-cell ${cell.traversalState} untargetable`}
        onMouseEnter={() => mouseHoverHandler(coord)}
      >
        <InnerCellComponent type={cell.type} weight={cell.weight} />
      </div>
    );
  }, (prevProps, nextProps) => {
    return prevProps.cell === nextProps.cell;
  });


//Parent/Ancestor component need to create a new row reference to trigger a re-render.
const RowComponent = React.memo(({y, row, mouseHoverHandler}) => {
    return (
        <div className={`grid-row untargetable`}>
            {row.map((cell, x) => {
                const key = createCoord(x, y);
                return (
                    <CellComponent
                        key={key}
                        coord={key}
                        cell={cell}
                        mouseHoverHandler={mouseHoverHandler}
                    />
                );
            })}
        </div>
    )
}, (prevProps, nextProps) => {
    return prevProps.row === nextProps.row;
});


//Parent/Ancestor component need to create a new matrix reference to trigger a re-render.
const GridComponent = React.memo(({matrix, mouseHoverHandler}) => {
    const ratio = matrix.length / matrix[0].length;
    const width = ratio < 1 ? 100 : 100 / ratio;
    const style = {width: width + "%"};

    return (
        <div className="grid-parent">
            <div 
                style={style}
                draggable="false"
                className={`grid-container untargetable`}
                onMouseLeave = {() => {
                    mouseHoverHandler(COORD_UNDEFINED);
                }}
            >
                {matrix.map((row, y) => {
                    return (
                        <RowComponent
                            y = {y}
                            key={y}
                            row={row}
                            mouseHoverHandler={mouseHoverHandler}
                        />
                    );
                })}
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.matrix === nextProps.matrix;
});

export {
    GridComponent,
}