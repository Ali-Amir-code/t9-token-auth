import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';

// Load env vars
config();

// Connect to database
connectDB();

const app = express();

// Body Parser Middleware
app.use(json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.json({ msg: 'Welcome to the Token-Based-Auth API' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));