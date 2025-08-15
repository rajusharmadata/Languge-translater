import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './services/Home';
import About from './services/About';
import Price from './services/Price';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Price />} />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default App;
