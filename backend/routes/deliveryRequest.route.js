import { createDeliveryRequest, acceptDeliveryRequest, getAcceptedRequestsByDriver} from "../controllers/deliveryRequest.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/create", protect, createDeliveryRequest);
router.post("/accept", protect, acceptDeliveryRequest);
router.get("/driveraccepted", protect, getAcceptedRequestsByDriver);

export default router;
