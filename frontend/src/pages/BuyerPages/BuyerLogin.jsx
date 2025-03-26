import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import './BuyerLogin.css'; // Import the CSS file
 
const BuyerLogin = () => { 
  const [formData, setFormData] = useState({ email: '', password: '' }); 
  const [errorMsg, setErrorMsg] = useState(''); 
  const [successMsg, setSuccessMsg] = useState(''); 
  const navigate = useNavigate(); 
 
  const handleChange = (e) => { 
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    })); 
    setErrorMsg(''); 
    setSuccessMsg(''); 
  }; 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try { 
      const response = await axios.post( 
        '/api/buyers/login', 
        formData, 
        { withCredentials: true } 
      ); 
      setSuccessMsg(response.data.message); 
      navigate('/buyer/profile'); 
    } catch (error) { 
      const message = error.response?.data?.message || 'Login failed.'; 
      setErrorMsg(message); 
    } 
  }; 
 
  return ( 
    <div className="buyer-login-container"> 
      <h2>Buyer Login</h2> 
      <form className="buyer-login-form" onSubmit={handleSubmit}> 
        {errorMsg && <p className="error-message">{errorMsg}</p>} 
        {successMsg && <p className="success-message">{successMsg}</p>} 
 
        <div className="form-group"> 
          <label>Email:</label> 
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          /> 
        </div> 
 
        <div className="form-group"> 
          <label>Password:</label> 
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          /> 
        </div> 
 
        <button className="login-button" type="submit">Login</button> 
      </form> 
    </div> 
  ); 
}; 
 
export default BuyerLogin;