import Driver from '../../models/deliveryModels/driver.model.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../../utils/generateToken.js';

// Register a new driver
const registerDriver = asyncHandler(async (req, res) => {
  const { name, email, password, district, NIC, contactNumber, vehicleNumber, vehicleCapacity } = req.body;

  // Check if the driver already exists
  const driverExists = await Driver.findOne({ email });

  if (driverExists) {
    res.status(409);
    throw new Error('Driver already exists. Please choose a different email.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new driver
  const driver = new Driver({
    name,
    email,
    password: hashedPassword,
    district,
    NIC,
    contactNumber,
    vehicleNumber,
    vehicleCapacity,
  });

  await driver.save();

  // Generate and send JWT token
  const token = generateToken(req, res, driver._id);

  res.status(201).json({
    message: 'Registration successful. Welcome!',
    driverId: driver._id,
    name: driver.name,
    email: driver.email,
    token,
  });
});

// Login driver
const loginDriver = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the driver by email
  const driver = await Driver.findOne({ email });
  if (!driver) {
    res.status(404);
    throw new Error('Invalid email address or password. Please try again.');
  }

  // Compare the entered password with the stored hashed password
  const match = await driver.matchPassword(password); // Use the model method
  console.log('Password match result:', match); // Debug log
  if (!match) {
    res.status(401);
    throw new Error('Invalid email address or password. Please try again.');
  }

  // Generate and send JWT token
  const token = generateToken(req, res, driver._id);

  res.status(200).json({
    message: 'Login successful.',
    driverId: driver._id,
    name: driver.name,
    email: driver.email,
    token,
  });
});

// Logout driver (clear JWT from cookies)
const logoutDriver = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    req.headers.authorization = '';
  }

  res.status(200).json({ message: 'Logout successful' });
};

// Update driver details
const updateDriver = asyncHandler(async (req, res) => {
  const { name, email, district, password, contactNumber, vehicleNumber, vehicleCapacity } = req.body;
  const driverId = req.user._id;

  const driver = await Driver.findById(driverId);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  if (name) driver.name = name;
  if (email) driver.email = email;
  if (district) driver.district = district;
  if (contactNumber) driver.contactNumber = contactNumber;
  if (vehicleNumber) driver.vehicleNumber = vehicleNumber;
  if (vehicleCapacity) driver.vehicleCapacity = vehicleCapacity;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    driver.password = await bcrypt.hash(password, salt);
  }

  await driver.save();

  res.status(200).json({
    message: "Driver details updated successfully",
    driver: {
      name: driver.name,
      email: driver.email,
      district: driver.district,
      contactNumber: driver.contactNumber,
      vehicleNumber: driver.vehicleNumber,
      vehicleCapacity: driver.vehicleCapacity,
    },
  });
});

// Delete driver account
const deleteDriver = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  const driver = await Driver.findByIdAndDelete(driverId);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  res.status(200).json({
    message: "Driver account deleted successfully",
  });
});

// Get driver details
const getDriverDetails = asyncHandler(async (req, res) => {
  const driverId = req.user._id;

  const driver = await Driver.findById(driverId).select('-password');

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  res.status(200).json({
    success: true,
    driver: {
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      district: driver.district || 'N/A',
      contactNumber: driver.contactNumber || 'N/A',
      vehicleNumber: driver.vehicleNumber || 'N/A',
      vehicleCapacity: driver.vehicleCapacity || 'N/A',
    }
  });
});

export { registerDriver, loginDriver, logoutDriver, updateDriver, deleteDriver, getDriverDetails };