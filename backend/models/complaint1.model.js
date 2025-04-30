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
  }
});

const Complaint1 = mongoose.model("Complaint1", complaint1Schema);
export default Complaint1;