import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './services/Home';
import About from './services/About';
import Price from './services/Price';
import Sinup from './services/Sinup';
import Sinin from './services/Sinin';
import VerifyOtp from './services/VerifyOtp';
import Translate from './services/Translate';
import ShippingPolicy from './components/ShippingPolicy';
import CancellationsRefunds from './components/CancellationsRefunds';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import TermsConditions from './components/TermsConditions';
import ForgotPassword from './services/ForgotPassword';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Payment from './services/Payment';
import ResetPassword from './services/RestPassword';
import Profile from './services/Profile';


const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/translate' element={<Translate />} />
          <Route path='/profile' element = {<Profile/>}/>
        </Route>
        <Route path='/' element={<Home />} />
        <Route path='/#about' element={<About />} />
        <Route path='/#pricing' element={<Price />} />
        <Route path='/signup' element={<Sinup />} />
        <Route path='/signin' element={<Sinin />} />
        <Route path='/verify' element={<VerifyOtp />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path='/shipping-policy' element={<ShippingPolicy />} />
        <Route path='/terms-and-conditions' element={<TermsConditions />} />
        <Route path='/cancellations-refunds' element={<CancellationsRefunds />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/frogetPassword' element={<ForgotPassword />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
