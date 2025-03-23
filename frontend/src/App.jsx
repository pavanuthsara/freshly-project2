import { useState } from 'react'
import './App.css'
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard'
import SignInSignUp from './pages/SignInSignUp';
import Sidebar from './components/DriverDashboardComponents/sidebar.component.jsx';


function App() {
  
  return (
    <>
      <div>
        <Sidebar/>
      </div>
    </>
  )
}

export default App;
