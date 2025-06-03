// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/ui/ui/Navbar'; // Assuming Navbar is in the components folder
// import Home from '../pages/Home'; // Assuming Home is in the pages folder

// const App = () => (
//   <Router>
    
//     {/* Define Routes */}
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/movies" element={<div>Movies Page (Coming Soon)</div>} />
//       <Route path="/shows" element={<div>Shows Page (Coming Soon)</div>} />
//     </Routes>
//   </Router>
// );

// export default App;

// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
// Import your pages
import Home from '../pages/Home';
// import Movies from '../pages/Movies';
// import Shows from '../pages/Shows';
// import MovieDetails from '../pages/MovieDetails';
// import ShowDetails from '../pages/ShowDetails';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/search" element={<div>Search Results Page</div>} />
        <Route path="/genre/:genre" element={<div>Genre Page</div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
      </Routes>
    </Layout>
  );
};

export default AppRoutes;