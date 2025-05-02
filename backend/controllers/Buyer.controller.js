import Buyer from '../models/buyer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
import transporter from '../config/email.js';

// LOGIN
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Buyer.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('Invalid email address. Please check your email and try again.');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.statusCode = 401;
      throw new Error('Invalid password. Please check your password and try again.');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set token in cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: 'Login successful.',
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    next(error);
  }
};

// REGISTER
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await Buyer.findOne({ email });

    if (userExists) {
      res.statusCode = 409;
      throw new Error('User already exists. Please choose a different email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Buyer({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    generateToken(req, res, user._id);

    res.status(201).json({
      message: 'Registration successful. Welcome!',
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });
  res.status(200).json({ message: 'Logout successful' });
};

// GET PROFILE
const getUserProfile = async (req, res, next) => {
  try {
    const user = await Buyer.findById(req.buyer._id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }

    res.status(200).json({
      message: 'User profile retrieved successfully',
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PROFILE
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await Buyer.findById(req.buyer._id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found. Unable to update profile.');
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User profile updated successfully.',
      userId: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (error) {
    next(error);
  }
};

// PASSWORD RESET EMAIL
const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Buyer.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found!');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    const passwordResetLink = `https://mern-shop-abxs.onrender.com/reset-password/${user._id}/${token}`;
    console.log(passwordResetLink); // dev only

    await transporter.sendMail({
      from: `"MERN Shop" ${process.env.EMAIL_FROM}`,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Hi ${user.name},</p>
        <p>Click below to reset your password:</p>
        <p><a href="${passwordResetLink}" target="_blank">${passwordResetLink}</a></p>
        <p>If you didn't request this, ignore this email.</p>`
    });

    res.status(200).json({ message: 'Password reset email sent. Please check your email.' });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id: userId, token } = req.params;
    const user = await Buyer.findById(userId);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken || decodedToken.userId !== userId) {
      res.statusCode = 401;
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    next(error);
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPasswordRequest,
  resetPassword
};
