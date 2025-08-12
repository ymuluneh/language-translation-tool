import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translationRoutes from './router/translationRoutes.js';
import pool from './config/db.js'; 

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/translate', translationRoutes);

// Create database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    console.log("Please check your database configuration in .env file.");
    process.exit(1);
  }
  console.log("Database connected successfully");
  connection.release();
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));