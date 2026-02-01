import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  });
});

router.get('/ready', (_req, res) => {
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  const ready = state === 1;
  res.status(ready ? 200 : 503).json({ ready, mongoState: state });
});

export default router;
