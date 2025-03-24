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
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    farmAddress: {
      type: addressSchema,
      required: true,
    },

});


export default mongoose.model("farmer", farmerSchema);