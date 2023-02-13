import React, {useState, useRef, useEffect} from 'react';
import './Button.css';

const ButtonDropdown = React.memo(
    ({label, value, setValue, options}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    let labelText = options.includes(value) ? value : label;

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
          document.removeEventListener('click', handleClickOutside, true);
        };
    }, [])

    return (
        <div ref={ref} 
          className='button-and-dropdown-container' 
          onClick = {toggleDropdown}
        >
            <button className={`button clickable clickable-div ${isOpen ? 'active-div' : ''}`}>
              <div className="dropdown-button-text-container">
                <div className="dropdown-button-text-container-left">
                  <a className="button-text"> {labelText} </a>
                </div>
                <div className="dropdown-button-text-container-right">
                  <div 
                    className="arrow"
                    dangerouslySetInnerHTML={{ __html: isOpen ? '&#9650;' : '&#9660;'}}            
                  />
                </div>
              </div>
            </button>
            <div className={`dropdown-content ${isOpen ? 'dropdown-open' : ''}`}>
                {options.map(value2 => (
                    
                    <a
                      className={`
                      button-text clickable 
                      clickable-black-text 
                      dropdown-item
                      ${value2 === value ? 'selected-div' : ''}`
                    }
                        key={value2}
                        onClick={() => setValue(value2)}
                    >
                        {value2}
                    </a>
                ))}
            </div>
        </div>
    );
},
    (prevProps, nextProps) => {
      return prevProps.value === nextProps.value &&
        prevProps.options === nextProps.options &&
        prevProps.setValue === nextProps.setValue;
    }
);

export default ButtonDropdown;