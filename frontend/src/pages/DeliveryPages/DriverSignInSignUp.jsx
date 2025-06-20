import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DriverSignInSignUp = ({ setIsAuthenticated, setUser }) => {
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

  // Validation Helper Functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateNIC = (nic) => {
    const nicRegex = /^(\d{12}|(\d{9}[vV]?))$/;
    return nicRegex.test(nic);
  };

  const validateContactNumber = (phone) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateVehicleNumber = (vehicleNumber) => {
    const vehicleRegex = /^[A-Z]{2,4}\d{4}$/;
    return vehicleRegex.test(vehicleNumber);
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch(name) {
      case 'name':
        processedValue = value.replace(/[^a-zA-Z\s-]/g, '').slice(0, 100);
        break;
      case 'district':
        processedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
        break;
      case 'NIC':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 12);
        break;
      case 'contactNumber':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'vehicleNumber':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!/\d/.test(processedValue)) {
          processedValue = processedValue.slice(0, 3);
        } else {
          const letters = processedValue.match(/[A-Z]{0,3}/)?.[0] || '';
          const numbers = processedValue.match(/\d{0,4}$/)?.[0] || '';
          if (letters.length >= 2 && letters.length <= 3) {
            processedValue = letters + numbers;
          } else {
            processedValue = letters.slice(0, 3) + numbers;
          }
        }
        break;
      case 'vehicleCapacity':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
        break;
    }

    setSignUpData({
      ...signUpData,
      [name]: processedValue
    });
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value
    });
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
      toast.error("Password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character.", { position: "top-right" });
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
      toast.error("Please enter a valid vehicle number (e.g., ABCD3456).", { position: "top-right" });
      return;
    }

    if (parseInt(signUpData.vehicleCapacity) < 100 || parseInt(signUpData.vehicleCapacity) > 30000) {
      toast.error("Vehicle capacity must be between 100 and 30000.", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/drivers/register`, signUpData);
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
      toast.error(error.response.data.message || 'Registration failed', { position: "top-right" });
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(signInData.email)) {
      toast.error("Please enter a valid email address.", { position: "top-right" });
      return;
    }

    if (signInData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.", { position: "top-right" });
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/drivers/login`, signInData);
      
      // Save the token in localStorage and cookie
      localStorage.setItem("token", response.data.token);
      document.cookie = `jwt=${response.data.token}; path=/; max-age=86400`;

      // Update user state if provided
      if (response.data.user) {
        setUser(response.data.user);
      }

      // Update authentication state
      setIsAuthenticated(true);

      toast.success('Login successful!', { position: "top-right" });
      navigate('/drivers/dashboard');
    } catch (error) {
      toast.error(error.response.data.message || 'Login failed', { position: "top-right" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`relative w-[768px] max-w-full min-h-[600px] rounded-lg shadow-lg bg-white overflow-hidden transition-all duration-600 ${isRightPanelActive ? "right-panel-active" : ""}`}
      >
        {/* Sign Up Form */}
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

        {/* Sign In Form */}
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

        {/* Overlay */}
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