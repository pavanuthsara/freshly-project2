import express from 'express';
import { 
    registerFarmer, 
    loginFarmer ,
    getAllFarmers, 
    deleteFarmer,
    getFarmerProfile,
    updateFarmerProfile } from '../controllers/farmer.controller.js';
import { farmerProtect } from '../middleware/farmer.middleware.js'; 

const router = express.Router();

// Farmer registration
router.post('/register', registerFarmer);

// Farmer login
router.post('/login', loginFarmer);

router.get('/', getAllFarmers);

router.delete('/delete/:id',farmerProtect, deleteFarmer);

router.get('/profile', farmerProtect, getFarmerProfile);
router.put('/profile', farmerProtect, updateFarmerProfile);
export default router;