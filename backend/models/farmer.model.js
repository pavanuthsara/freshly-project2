import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  streetNo: {
    type: String,
    required: [true, 'Street number is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  district: {
    type: String,
    required: [true, 'District is required'],
  },
});

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    trim: true,
  },
  farmAddress: {
    type: addressSchema,
    required: [true, 'Farm address is required'],
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Farmer", farmerSchema);