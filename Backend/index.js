import express from 'express'
import dotenv from 'dotenv'
import Razorpay from 'razorpay';
import { dbConnection } from './db/db.js';
const app = express();
import {router} from "./router/api.router.js"

const port = 8080;
dotenv.config({ path: '.env' })

app.use(express.json())
app.get('/', (req, res) => {
    res.send("<H1>Backend is working </H1>")
})
// Razorpay setup route
 export const razorpay = new Razorpay({
  key_id:process.env,
  key_secret: process.env,
});

// Dbconection
dbConnection();

app.use('/api/v1',router);


app.listen(port, () => {
    console.log(`App is listen on the port ${port} `);
})
