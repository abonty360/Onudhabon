import express from 'express';
const router = express.Router();

router.get('/api/hello', (req, res) => {
  res.send('Hello from Express!');
});

router.post('/api/data', (req, res) => {
  res.json({ message: 'Data received', data: req.body });
});

export default router;
