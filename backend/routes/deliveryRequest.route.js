import { createDeliveryRequest, acceptDeliveryRequest } from "../controllers/deliveryRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/create", protect, createDeliveryRequest);
router.post("/accept", protect, acceptDeliveryRequest);

export default router;
