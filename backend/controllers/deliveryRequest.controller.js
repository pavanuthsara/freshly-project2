import DeliveryRequest from "../models/deliveryRequest.model.js";
import AcceptedDeliveryRequest from "../models/acceptedDeliveryRequest.model.js";
import asyncHandler from "express-async-handler";

// 🔹 Create Delivery Request
const createDeliveryRequest = asyncHandler(async (req, res) => {
    const { deliveryId, farmerId, weight, pickup, dropOff } = req.body;
    const buyerId = req.user._id;
  
    const deliveryRequest = await DeliveryRequest.create({
      deliveryId,
      buyerId,
      farmerId,
      weight,
      pickup,
      dropOff,
      status: "pending",
    });
  
    res.status(201).json(deliveryRequest);
  });


  // 🔹 Accept Delivery Request
const acceptDeliveryRequest = asyncHandler(async (req, res) => {
  const { deliveryId} = req.body;
  const driverId = req.driver._id;

  // Find the pending delivery request
  const deliveryRequest = await DeliveryRequest.findOne({ deliveryId, status: "pending" });

  if (!deliveryRequest) {
    return res.status(404).json({ message: "Delivery request not found" });
  }

  // Create an accepted request
  const acceptedRequest = await AcceptedDeliveryRequest.create({
    deliveryId: deliveryRequest.deliveryId,
    buyerId: deliveryRequest.buyerId,
    farmerId: deliveryRequest.farmerId,
    driverId, // Ensure this is passed in the request body
    weight: deliveryRequest.weight,
    pickup: deliveryRequest.pickup,
    dropOff: deliveryRequest.dropOff,
    status: "accepted",
  });

  //Delete the original req
  await DeliveryRequest.deleteOne({ _id: deliveryRequest._id });

  res.status(201).json(acceptedRequest);
});
 

// Get Accepted Delivery Request
const getAcceptedRequestsByDriver = asyncHandler(async (req, res) => {
  const driverId = req.driver._id;

  const acceptedRequests = await AcceptedDeliveryRequest.find({ driverId });

  res.json(acceptedRequests);
});
 



export { createDeliveryRequest, acceptDeliveryRequest, getAcceptedRequestsByDriver};