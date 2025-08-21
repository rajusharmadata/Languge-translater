import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx';
import AppProvider from './context/App';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </AppProvider>
);
