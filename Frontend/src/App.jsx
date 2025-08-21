import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './services/Home';
import About from './services/About';
import Price from './services/Price';
import Sinup from './services/Sinup';
import Sinin from './services/Sinin';


const App = () => {
  return (
    <>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/pricing' element={<Price />} />
          <Route path='/signup' element={<Sinup />} />
          <Route path='/signin' element={<Sinin />} />
        </Routes>
      
    </>

  );
};

export default App;
