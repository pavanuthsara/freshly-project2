import mongoose from "mongoose";

const acceptedDeliveryRequestSchema = mongoose.Schema(
  {
    deliveryId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    dropOff: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "accepted",
    },
  },
  {
    timestamps: true,
  }
);

const AcceptedDeliveryRequest = mongoose.model("AcceptedDeliveryRequest", acceptedDeliveryRequestSchema);

export default AcceptedDeliveryRequest;