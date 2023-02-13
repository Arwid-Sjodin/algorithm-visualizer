import React from 'react';

const ButtonStandard = React.memo(
  ({enabled, onClick, text}) => {
      return (
        <button
            disabled={!enabled}
            className={`clickable clickable-div button`}
            onClick={onClick}
        >
            <a className="button-text"> {text} </a>
        </button>
      );

  }, 
  (prevProps, nextProps) => {
    return prevProps.enabled === nextProps.enabled &&
      prevProps.text === nextProps.text && prevProps.onClick === nextProps.onClick;
  }
);


export default ButtonStandard;