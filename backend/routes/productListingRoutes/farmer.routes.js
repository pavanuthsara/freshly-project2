import express from 'express';
  import { 
      registerFarmer, 
      loginFarmer,
      forgotPassword,
      resetPassword,
      getAllFarmers, 
      deleteFarmer,
      getFarmerProfile,
      updateFarmerProfile 
  } from '../../controllers/productListingControllers/farmer.controller.js';
  import { farmerProtect } from '../../middleware/productListingMiddleware/farmer.middleware.js'; 

  console.log('✅ farmer.routes.js loaded'); // Add for debugging

  const router = express.Router();

  // Farmer registration
  router.post('/register', registerFarmer);

  // Farmer login
  router.post('/login', loginFarmer);

  // Forgot password
  router.post('/forgot-password', forgotPassword);

  // Reset password
  router.post('/reset-password', resetPassword);

  router.get('/', getAllFarmers);

  router.delete('/delete/:id', farmerProtect, deleteFarmer);

  router.get('/profile', farmerProtect, getFarmerProfile);
  router.put('/profile', farmerProtect, updateFarmerProfile);

  export default router;