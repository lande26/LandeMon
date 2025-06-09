import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ULayout from '../components/layout/ULayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import UserHome from '../pages/UserHome';
import Movies from '../pages/Movies';
import Shows from '../pages/Shows';


const router = createBrowserRouter([
   {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup', 
    element: <SignUp />
  },
  
  {
    path: '/user',
    element: (
        <ULayout>
          <UserHome />
        </ULayout>
    )
  },
  {
    path: '/user/movies',
    element: (
      <ULayout>
        <Movies />
      </ULayout>
    )
  },
  {
    path: '/user/shows',
    element: (
      <ULayout>
        <Shows />
      </ULayout>
    )
  },

  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;