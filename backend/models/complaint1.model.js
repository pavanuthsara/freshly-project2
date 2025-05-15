import mongoose from 'mongoose';

const complaint1Schema = new mongoose.Schema({
  contactNo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Complaint1 = mongoose.model("Complaint1", complaint1Schema);
export default Complaint1; 