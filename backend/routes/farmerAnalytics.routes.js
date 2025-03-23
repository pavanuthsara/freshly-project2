import express from 'express';
const router = express.Router();

router.get('/analytics', (req, res) => {
    res.json({ message: "Farmer analytics data" });
});

export default router; 
