import express from 'express'
import { connectDB } from './config/db.js';

import deliveryRequestRoutes from './routes/deliveryRequest.route.js';
import driverRoutes from './routes/driver.route.js';

const app = express();
app.use(express.json());

app.use('/api/deliveryrequest', deliveryRequestRoutes);
app.use('/api/drivers', driverRoutes);

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000 http://localhost:3000");
});
