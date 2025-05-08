import express from 'express';
import { generateGooglePlan } from '../controllers/feedbackControllers/feedbackhelpbot.controller.js'
import { generateFarmerPlan } from '../controllers/farmerAnalytics/farmerHelpBot.controller.js'

const router = express.Router();

router.post('/feedbackbot', generateGooglePlan)
router.post('/farmerbot', generateFarmerPlan)

export default router;