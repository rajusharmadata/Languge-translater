import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './services/Home';
import About from './services/About';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
     
      </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
