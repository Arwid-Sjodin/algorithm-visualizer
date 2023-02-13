import React from 'react';
import './Home.css';
import { NavLink } from 'react-router-dom';

const Home = () => {
    return (
        <div className="page-container">
            <div className="pages-grid">
                <div className="page-cell clickable clickable-div">
                    <NavLink to="/sort"  className="page-image page-sort"/>
                </div>
                <div className="page-cell clickable clickable-div">
                    <NavLink to="/pathfind" className="page-image page-pathfind"/>
                </div>
            </div>
        </div>
    );
}

export default Home;
