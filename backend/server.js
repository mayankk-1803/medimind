import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medimind-gamma.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests
app.options("/*", cors());

app.use(express.json());


app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/reports', reportRoutes);

// Basic health check route

app.get("/", (req, res) => {
  res.send("MediMind AI Backend Running 🚀");
});


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'MediMind AI Backend is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
