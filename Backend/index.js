import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // should be here
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import { dbConnection } from './db/db.js';
import { router } from './router/api.router.js';

const app = express();

const port = process.env.PORT ||8080;


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use env variable
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  })
);
// Default route for checking backend status
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working successfully!',
    timestamp: new Date().toISOString()
  });
});
// Dbconection
dbConnection();
// api route
app.use('/api/v1', router);


// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📡 Backend URL: http://localhost:${port}`);
});
