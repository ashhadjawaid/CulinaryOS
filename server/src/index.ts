import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());

import apiRoutes from './routes/api';
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.send('CulinaryOS API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
