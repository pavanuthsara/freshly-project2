import Farmer from '../../models/productListingModels/farmer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// @desc     Register a farmer
// @method   POST
// @endpoint /api/farmers/register
// @access   Public
const registerFarmer = async (req, res, next) => {
  try {
    const { name, email, password, phone, nic, farmAddress } = req.body;

    // Check if the password is provided
    if (!password) {
      res.statusCode = 400;
      throw new Error('Password is required.');
    }

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      res.statusCode = 409;
      throw new Error('Farmer already exists. Please choose a different email.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new farmer
    const farmer = new Farmer({
      name,
      email,
      password: hashedPassword,
      phone,
      nic,
      farmAddress,
    });

    // Save the farmer
    await farmer.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: farmer._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/'
    });

    // Send response
    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      farmerId: farmer._id,
      name: farmer.name,
      email: farmer.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Login a farmer
// @method   POST
// @endpoint /api/farmers/login
// @access   Public
const loginFarmer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the farmer
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      res.statusCode = 404;
      throw new Error('Invalid email or password.');
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      res.statusCode = 401;
      throw new Error('Invalid email or password.');
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: farmer._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/'
    });

    // Send response
    res.status(200).json({
      success: true,
      message: 'Farmer logged in successfully',
      farmerId: farmer._id,
      name: farmer.name,
      email: farmer.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Forgot password
// @method   POST
// @endpoint /api/farmers/forgot-password
// @access   Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      res.statusCode = 404;
      throw new Error('No account found with that email.');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    
    // Set token and expiry on farmer document
    farmer.resetPasswordToken = resetTokenHash;
    farmer.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await farmer.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: farmer.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Reset password
// @method   POST
// @endpoint /api/farmers/reset-password
// @access   Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find farmer with matching reset token and valid expiry
    const farmer = await Farmer.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!farmer) {
      res.statusCode = 400;
      throw new Error('Invalid or expired reset token');
    }

    // Verify token
    const isTokenValid = await bcrypt.compare(token, farmer.resetPasswordToken);
    if (!isTokenValid) {
      res.statusCode = 400;
      throw new Error('Invalid reset token');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    farmer.password = hashedPassword;
    farmer.resetPasswordToken = undefined;
    farmer.resetPasswordExpires = undefined;
    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get all farmers
// @method   GET
// @endpoint /api/farmers
// @access   Private (or Public, depending on your requirements)
const getAllFarmers = async (req, res, next) => {
  try {
    // Fetch all farmers from the database
    const farmers = await Farmer.find({}, { _id: 1, name: 1, email: 1 });

    // Check if farmers exist
    if (!farmers || farmers.length === 0) {
      res.statusCode = 404;
      throw new Error('No farmers found.');
    }

    // Send response
    res.status(200).json({
      success: true,
      message: 'Farmers retrieved successfully',
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFarmer = async (req, res, next) => {
  try {
    const farmerId = req.params.id;

    // Check if the farmerId is a valid ObjectId
    if (!mongoose.isValidObjectId(farmerId)) {
      res.statusCode = 400;
      throw new Error('Invalid farmer ID.');
    }

    // Find the farmer
    const farmer = await Farmer.findById(farmerId);

    // Check if the farmer exists
    if (!farmer) {
      res.statusCode = 404;
      throw new Error('Farmer not found.');
    }

    // Check if the authenticated farmer is deleting their own account
    if (req.farmer._id.toString() !== farmer._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to delete this farmer.');
    }

    // Delete the farmer
    await Farmer.deleteOne({ _id: farmer._id });

    // Send response
    res.status(200).json({
      success: true,
      message: 'Farmer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get farmer profile
// @method   GET
// @endpoint /api/farmers/profile
// @access   Private
const getFarmerProfile = async (req, res, next) => {
  try {
    // req.farmer is set by the farmerProtect middleware
    const farmer = await Farmer.findById(req.farmer._id).select('-password');

    if (!farmer) {
      res.statusCode = 404;
      throw new Error('Farmer not found.');
    }

    res.status(200).json({
      success: true,
      farmer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Update farmer profile
// @method   PUT
// @endpoint /api/farmers/profile
// @access   Private
const updateFarmerProfile = async (req, res, next) => {
  try {
    const { name, phone, farmAddress } = req.body;

    // Find the farmer
    const farmer = await Farmer.findById(req.farmer._id);

    if (!farmer) {
      res.statusCode = 404;
      throw new Error('Farmer not found.');
    }

    // Update fields
    farmer.name = name || farmer.name;
    farmer.phone = phone || farmer.phone;
    
    // Update farm address if provided
    if (farmAddress) {
      farmer.farmAddress.streetNo = farmAddress.streetNo || farmer.farmAddress.streetNo;
      farmer.farmAddress.city = farmAddress.city || farmer.farmAddress.city;
      farmer.farmAddress.district = farmAddress.district || farmer.farmAddress.district;
    }

    // Save updated farmer
    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      farmer: {
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        farmAddress: farmer.farmAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

export { 
  registerFarmer, 
  loginFarmer, 
  forgotPassword,
  resetPassword,
  getAllFarmers, 
  deleteFarmer,
  getFarmerProfile,
  updateFarmerProfile
};