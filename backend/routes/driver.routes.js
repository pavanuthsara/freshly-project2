import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

import { registerDriver,
         loginDriver,
         logoutDriver,
         updateDriver,
         deleteDriver,
         getDriverDetails,
         } from '../controllers/driver.controller.js';

import { validateDriverRegistration,
         validateDriverLogin } from '../middleware/driverValidator.middleware.js';

const router = express.Router();

// Driver Registration Route
router.post('/register', validateDriverRegistration, registerDriver);

// Driver Login Route
router.post('/login', validateDriverLogin, loginDriver);

// Driver Logout Route
router.post('/logout', protect,logoutDriver);

// Route to get driver details
router.get("/profile", protect, getDriverDetails);

// Route to update driver details
router.put("/profile", protect, updateDriver);

// Route to delete driver account
router.delete("/profile", protect, deleteDriver);


export default router;
