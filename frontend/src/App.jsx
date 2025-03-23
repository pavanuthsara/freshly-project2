import { useState } from 'react'
import './App.css'
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard'
import SignInSignUp from './pages/SignInSignUp';
import AnalyticsDashboard from './components/FarmerDashboardComponents/AnalyticsDashboard';

function App() {
  
  return (
    <>
      <div>
        <AnalyticsDashboard />
      </div>
    </>
  )
}

export default App;
