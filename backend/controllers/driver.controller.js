import Driver from '../models/driver.model.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateDriverToken } from '../utils/generateToken.js';

// Register a new driver
const registerDriver = async (req, res, next) => {
  try {
    const { name, email, password, district, NIC, contactNumber, vehicleNumber, vehicleCapacity } = req.body;

    // Check if the driver already exists
    const driverExists = await Driver.findOne({ email });

    if (driverExists) {
      res.statusCode = 409;
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
    const token = generateDriverToken(req, res, driver._id); // Generate token for driver

    res.status(201).json({
      message: 'Registration successful. Welcome!',
      driverId: driver._id,
      name: driver.name,
      email: driver.email,
      token,  // Send the token in the response
    });
  } catch (error) {
    next(error);
  }
};

// Login driver
const loginDriver = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the driver by email
    const driver = await Driver.findOne({ email });
    if (!driver) {
      res.statusCode = 404;
      throw new Error('Invalid email address. Please check your email and try again.');
    }

    // Compare the entered password with the stored hashed password
    const match = await bcrypt.compare(password, driver.password);
    if (!match) {
      res.statusCode = 401;
      throw new Error('Invalid password. Please check your password and try again.');
    }

    // Generate and send JWT token
    const token = generateDriverToken(req, res, driver._id); // Generate token for driver

    res.status(200).json({
      message: 'Login successful.',
      driverId: driver._id,
      name: driver.name,
      email: driver.email,
      token, // Send the token in the response
    });
  } catch (error) {
    next(error);
  }
};

// Logout driver (clear JWT from cookies)
const logoutDriver = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });  // Clear JWT cookie

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Invalidate the token by setting it to an empty string
    req.headers.authorization = '';
  }
  
  res.status(200).json({ message: 'Logout successful' });
};

//update driver details
const updateDriver = asyncHandler(async (req, res) => {
  const { name, email, district, password, contactNumber, vehicleNumber, vehicleCapacity } = req.body;
  const driverId = req.driver._id;  // Get the logged-in driver's ID from JWT token

  // Find the driver by their ID
  const driver = await Driver.findById(driverId);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  // Update the driver's details
  if (name) driver.name = name;
  if (email) driver.email = email;
  if (district) driver.district = district;
  if (contactNumber) driver.contactNumber = contactNumber;
  if (vehicleNumber) driver.vehicleNumber = vehicleNumber;
  if (vehicleCapacity) driver.vehicleCapacity = vehicleCapacity;

  // Check if password is being updated
  if (password) {
    const salt = await bcrypt.genSalt(10);
    driver.password = await bcrypt.hash(password, salt);
  }

  // Save the updated driver data
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

// @desc    Delete Driver Account
// @route   DELETE /api/v1/driver/profile
// @access  Private (Only logged-in driver can delete their profile)
const deleteDriver = asyncHandler(async (req, res) => {
  const driverId = req.driver._id;  // Get the logged-in driver's ID from JWT token

  // Find and delete the driver by their ID
  const driver = await Driver.findByIdAndDelete(driverId);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  res.status(200).json({
    message: "Driver account deleted successfully",
  });
});

// @desc    Get Driver Details
// @route   GET /api/v1/driver/profile
// @access  Private (Only logged-in driver can view their details)
const getDriverDetails = asyncHandler(async (req, res) => {
  const driverId = req.driver._id;  // Get the logged-in driver's ID from JWT token

  // Find the driver by their ID and exclude password field for security
  const driver = await Driver.findById(driverId).select('-password');

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  res.status(200).json({
    message: "Driver details retrieved successfully",
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

export { registerDriver, loginDriver, logoutDriver, updateDriver, deleteDriver, getDriverDetails };
