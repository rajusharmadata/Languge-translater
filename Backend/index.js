import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // should be here
import cookieParser from 'cookie-parser';
import express from 'express';
import Razorpay from 'razorpay';
import { dbConnection } from './db/db.js';
import { router } from './router/api.router.js';

const app = express();

const port = 8080;

// middleware
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('<H1>Backend is working </H1>');
});

// Dbconection
dbConnection();

app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`App is listen on the port ${port} `);
});
