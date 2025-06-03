// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import './index.css'
// import App from './routes/AppRoutes.jsx'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './index.css';


const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
