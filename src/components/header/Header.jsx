
import React from "react";
import { NavLink } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <nav className="header">
        <div className="logo-container">
          <NavLink to="/" className="logo">
              <img src="images/logo.png" className="logo-img" alt="Home" />
              <span className="logo-text"> 
                Algorithm Visualizer 
              </span>
          </NavLink>
        </div>
        <div className="link-container">
            <NavLink to="/sort" className="link-a"> Sort </NavLink>
            <NavLink to="/pathfind" className="link-a"> Pathfind </NavLink>
        </div>
    </nav>
  );
}

export default Header;
