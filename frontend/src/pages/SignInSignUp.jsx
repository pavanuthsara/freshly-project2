import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DriverSignInSignUp = ({ setUser, setIsAuthenticated }) => {
  const baseURL = "http://localhost:5000";
  const navigate = useNavigate();

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    NIC: '',
    contactNumber: '',
    vehicleNumber: '',
    vehicleCapacity: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const validateName = (name) => /^[a-zA-Z\s-]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateNIC = (nic) => /^(\d{12}|\d{9}[vV]?)$/.test(nic);
  const validateContactNumber = (phone) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
  const validateVehicleNumber = (vehicleNumber) => /^[A-Z]{2,4}\d{4}$/.test(vehicleNumber);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    switch(name) {
      case 'name':
        processedValue = value.replace(/[^a-zA-Z\s-]/g, '');
        break;
      case 'district':
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'NIC':
        if (value.length <= 9) {
          processedValue = value.replace(/[^0-9vV]/g, '').replace(/v/g, 'V');
        } else {
          processedValue = value.replace(/[^0-9]/g, '');
        }
        break;
      case 'contactNumber':
        processedValue = value.replace(/[^0-9+]/g, '');
        break;
      case 'vehicleNumber':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        break;
      case 'vehicleCapacity':
        processedValue = value.replace(/[^0-9]/g, '');
        break;
    }
    setSignUpData({ ...signUpData, [name]: processedValue });
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(signUpData.name)) {
      toast.error("Please enter a valid name (letters only).", { position: "top-right" });
      return;
    }
    if (!validateEmail(signUpData.email)) {
      toast.error("Please enter a valid email address.", { position: "top-right" });
      return;
    }
    if (!validatePassword(signUpData.password)) {
      toast.error("Password must be at least 8 characters.", { position: "top-right" });
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }
    if (!validateNIC(signUpData.NIC)) {
      toast.error("Please enter a valid NIC number.", { position: "top-right" });
      return;
    }
    if (!validateContactNumber(signUpData.contactNumber)) {
      toast.error("Please enter a valid contact number.", { position: "top-right" });
      return;
    }
    if (!validateVehicleNumber(signUpData.vehicleNumber)) {
      toast.error("Please enter a valid vehicle number (e.g., ABCD1234).", { position: "top-right" });
      return;
    }
    if (parseInt(signUpData.vehicleCapacity) < 100 || parseInt(signUpData.vehicleCapacity) > 30000) {
      toast.error("Vehicle capacity must be between 100 and 30000.", { position: "top-right" });
      return;
    }

    try {
      console.log('SignUp Payload:', signUpData);
      const response = await axios.post(`${baseURL}/api/drivers/register`, signUpData);
      console.log('SignUp Response:', response.data);
      toast.success('Registration successful!', { position: "top-right" });

      setSignUpData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        district: '',
        NIC: '',
        contactNumber: '',
        vehicleNumber: '',
        vehicleCapacity: ''
      });
      setIsRightPanelActive(false);
    } catch (error) {
      console.error('SignUp Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed', { position: "top-right" });
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(signInData.email)) {
      toast.error("Please enter a valid email address.", { position: "top-right" });
      return;
    }
    if (!validatePassword(signInData.password)) {
      toast.error("Password must be at least 8 characters.", { position: "top-right" });
      return;
    }

    try {
      console.log('Login Payload:', signInData);
      const response = await axios.post(`${baseURL}/api/drivers/login`, signInData);
      console.log('Login Response:', response.data);

      // Save token and user data
      localStorage.setItem("token", response.data.token);
      document.cookie = `jwt=${response.data.token}; path=/; max-age=2592000; sameSite=strict`; // 30 days

      // Set user and authentication state
      setUser({
        driverId: response.data.driverId,
        name: response.data.name,
        email: response.data.email
      });
      setIsAuthenticated(true);

      toast.success('Login successful!', { position: "top-right" });
      navigate('/drivers/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed', { position: "top-right" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`relative w-[768px] max-w-full min-h-[600px] rounded-lg shadow-lg bg-white overflow-hidden transition-all duration-600 ${isRightPanelActive ? "right-panel-active" : ""}`}
      >
        <div className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center transition-all duration-600 ${isRightPanelActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <form className="flex flex-col items-center text-center p-6" onSubmit={handleSignUpSubmit}>
            <h1 className="text-xl font-bold">Create Account</h1>
            <span className="text-sm">or use your email for registration</span>
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="password" name="confirmPassword" value={signUpData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" name="district" value={signUpData.district} onChange={handleSignUpChange} placeholder="District" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" name="NIC" value={signUpData.NIC} onChange={handleSignUpChange} placeholder="NIC" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" name="contactNumber" value={signUpData.contactNumber} onChange={handleSignUpChange} placeholder="Contact Number" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" name="vehicleNumber" value={signUpData.vehicleNumber} onChange={handleSignUpChange} placeholder="Vehicle Number" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="number" name="vehicleCapacity" value={signUpData.vehicleCapacity} onChange={handleSignUpChange} placeholder="Vehicle Capacity in KG" required min="100" />
            <button className="mt-4 px-6 py-2 text-white bg-green-500 rounded-full" type="submit">Sign Up</button>
          </form>
        </div>

        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-600 ${isRightPanelActive ? "opacity-0 z-0" : "opacity-100 z-10"}`}>
          <form className="flex flex-col items-center text-center p-6" onSubmit={handleSignInSubmit}>
            <h1 className="text-xl font-bold">Sign in</h1>
            <span className="text-sm">or use your account</span>
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" required />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" required />
            <a href="#" className="text-sm mt-2">Forgot your password?</a>
            <button className="mt-4 px-6 py-2 text-white bg-green-500 rounded-full" type="submit">Sign In</button>
          </form>
        </div>

        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-green-400 to-lime-500 flex items-center justify-center text-white p-8 transition-transform duration-600" style={{ transform: isRightPanelActive ? "translateX(-100%)" : "translateX(0)" }}>
          <div className="text-center">
            {isRightPanelActive ? (
              <>
                <h1 className="text-2xl font-bold">Welcome Back!</h1>
                <p className="mt-2">To keep connected with us please login with your personal info</p>
                <button onClick={() => setIsRightPanelActive(false)} className="mt-4 px-6 py-2 border-white border rounded-full">Sign In</button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Hello, Driver!</h1>
                <p className="mt-2">Enter your personal details and start the journey with us</p>
                <button onClick={() => setIsRightPanelActive(true)} className="mt-4 px-6 py-2 border-white border rounded-full">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSignInSignUp;