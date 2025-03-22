import express from 'express'
import { connectDB } from './config/db.js';


const app = express();
app.use(express.json());

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000 http://localhost:3000");
});
