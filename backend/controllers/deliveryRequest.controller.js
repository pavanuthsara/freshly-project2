import DeliveryRequest from "../models/deliveryRequest.model.js";
import Driver from "../models/driver.model.js";
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
  const driverId = req.user._id;

  // Find the driver and the delivery request
  const driver = await Driver.findById(driverId);
  // Find the pending delivery request
  const deliveryRequest = await DeliveryRequest.findOne({ deliveryId, status: "pending" });

  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }


  if (!deliveryRequest) {
    return res.status(404).json({ message: "Delivery request not found" });
  }

  // Calculate total weight of accepted requests
  const acceptedRequests = await DeliveryRequest.find({
    driver: driverId,
    status: 'ACCEPTED'
  });

  const currentTotalWeight = acceptedRequests.reduce((total, request) => total + request.weight, 0);

    // Check if adding this request exceeds vehicle capacity
    if (currentTotalWeight + deliveryRequest.weight > driver.vehicleCapacity) {
      return res.status(400).json({ 
        message: 'Adding this request would exceed vehicle capacity',
        currentTotalWeight,
        requestWeight: deliveryRequest.weight,
        vehicleCapacity: driver.vehicleCapacity
      });
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
  const driverId = req.user._id;

  const acceptedRequests = await AcceptedDeliveryRequest.find({ driverId });

  res.json(acceptedRequests);
});


// 🔹 Get All Pending Delivery Requests
const getPendingDeliveryRequests = asyncHandler(async (req, res) => {
  const user = req.user;
  let pendingRequests;

  // Use the added userType instead of constructor.modelName
  switch (user.userType) {
    case 'Driver':
      pendingRequests = await DeliveryRequest.find({ status: "pending" })
        .populate({
          path: 'buyerId',
          model: 'Buyer', // Explicitly specify model
          select: 'name email phone'
        })
        .populate({
          path: 'farmerId',
          model: 'Farmer', // Explicitly specify model
          select: 'name email phone farmName location'
        })
        .sort({ createdAt: -1 });
      break;

    case 'Buyer':
      pendingRequests = await DeliveryRequest.find({ 
        buyerId: user._id, 
        status: "pending" 
      })
        .populate({
          path: 'farmerId',
          model: 'Farmer', // Explicitly specify model
          select: 'name email phone farmName location'
        })
        .sort({ createdAt: -1 });
      break;

    case 'Farmer':
      pendingRequests = await DeliveryRequest.find({ 
        farmerId: user._id, 
        status: "pending" 
      })
        .populate({
          path: 'buyerId',
          model: 'Buyer', // Explicitly specify model
          select: 'name email phone'
        })
        .sort({ createdAt: -1 });
      break;

    default:
      return res.status(403).json({ message: "Unauthorized access" });
  }

  res.json(pendingRequests);
});
 

// capacity calculation with current weight tracking
const capacityCalculation = asyncHandler(async (req, res) => {
  try {
    const driverId = req.user._id;  // Get the logged-in driver's ID from JWT token

    // Find the driver by their ID and include capacity
    const driver = await Driver.findById(driverId).select('vehicleCapacity');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Calculate total weight of accepted requests
    const acceptedRequests = await DeliveryRequest.find({
      driver: driverId,
      status: 'ACCEPTED'
    });

    const currentTotalWeight = acceptedRequests.reduce((total, request) => total + request.weight, 0);

    res.json({ 
      vehicleCapacity: driver.vehicleCapacity,
      currentTotalWeight
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vehicle capacity' });
  }
});



export { createDeliveryRequest, acceptDeliveryRequest, getAcceptedRequestsByDriver, getPendingDeliveryRequests, capacityCalculation };