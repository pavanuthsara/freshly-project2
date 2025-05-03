// Driver registration validation middleware
const validateDriverRegistration = (req, res, next) => {
  const { name, email, password, district, NIC, contactNumber, vehicleNumber, vehicleCapacity } = req.body;
  if (!name || !email || !password || !district || !NIC || !contactNumber || !vehicleNumber || !vehicleCapacity) {
    return res.status(400).json({ message: 'All fields are required for registration.' });
  }
  // Add more validation as needed (email format, password strength, etc.)
  next();
};

// Driver login validation middleware
const validateDriverLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required for login.' });
  }
  next();
};

export { validateDriverRegistration, validateDriverLogin }; 