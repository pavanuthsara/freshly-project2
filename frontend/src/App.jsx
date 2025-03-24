import { useState } from 'react'
import './App.css'
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard'
import SignInSignUp from './pages/SignInSignUp';
import Sidebar from './components/DriverDashboardComponents/sidebar.component.jsx';
import DriverSignInSignUp from './pages/DeliveryPages/DriverSignInSignUp.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import {ToastContainer, toast} from 'react-toastify';



const App = () => {

  return (
    <div>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<DriverSignInSignUp />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}  

export default App;
