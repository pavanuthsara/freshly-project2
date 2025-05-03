import mongoose from "mongoose";
import { Schema } from "mongoose";

const deliveryRequestSchema = Schema(
  {
    deliveryId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "Farmer",
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
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryRequest = mongoose.model("DeliveryRequest", deliveryRequestSchema);


export default DeliveryRequest;