import express from 'express';
import { buyerProtect } from '../middleware/auth.middleware.js';
import { registerDriver, loginDriver, logoutDriver, updateDriver, deleteDriver, getDriverDetails} from '../controllers/driverController.js';
import { validateDriverRegistration, validateDriverLogin } from '../middleware/driverValidator.js';

const router = express.Router();

// Driver Registration Route
router.post('/register', validateDriverRegistration, registerDriver);

// Driver Login Route
router.post('/login', validateDriverLogin, loginDriver);

// Driver Logout Route
router.post('/logout', buyerProtect, logoutDriver);

// Route to get driver details
router.get("/profile", buyerProtect, getDriverDetails);

// Route to update driver details
router.put("/profile", buyerProtect, updateDriver);

// Route to delete driver account
router.delete("/profile", buyerProtect, deleteDriver);

export default router;
