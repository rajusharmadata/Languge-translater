import express from 'express'
import dotenv from 'dotenv'
import { dbConnection } from './db/db.js';
const app = express();

const port = 8080;
dotenv.config({ path: '.env' })



app.get('/', (req, res) => {
    res.send("<H1>Backend is working </H1>")
})

// Dbconection
dbConnection();

app.listen(port, () => {
    console.log(`App is listen on the port ${port} `);
})
