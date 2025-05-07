import express from 'express';
import { generateGooglePlan } from '../controllers/feedbackControllers/feedbackhelpbot.controller.js'

const router = express.Router();

router.post('/feedbackbot', generateGooglePlan)

export default router;