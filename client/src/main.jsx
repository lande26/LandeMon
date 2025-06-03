// src/main.jsx - Make sure this is correct
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <div className="bg-red-500 text-white p-4">Tailwind Test</div> */}
    <App />
  </React.StrictMode>
);