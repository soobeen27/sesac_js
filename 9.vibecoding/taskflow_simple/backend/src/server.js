import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createRouter } from './routes/index.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: false,
  })
);

app.use(express.json());

app.use('/api/v1', createRouter());

app.listen(port, () => {
  console.log(`✅ TaskFlow API running on http://localhost:${port}`);
});
