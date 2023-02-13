import React from 'react';
import { Home, Sort, Pathfinding } from './pages'
import {    
  Header, 
  Footer,
} from './components'
import { Routes, Route} from 'react-router-dom';
import './App.css';


const App = () => {
  return (
    <div>
      <Header/>
      <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/sort" element={<Sort/>} />
          <Route exact path="/pathfind" element={<Pathfinding/>} />
      </Routes>
      <Footer/>
    </div>
  );
}


export default App;
