import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const driverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    district: {
      type: String,
      required: true,
      enum: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle", "Matale", "Nuwara Eliya"],
    },
    password: {
      type: String,
      required: true,
    },
    NIC: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    vehicleCapacity: {
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash the password before saving the driver document, but only if it's new or modified
driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password && !this.password.startsWith('$2')) { // Check if not already hashed
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;