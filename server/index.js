const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ruleRoutes = require('./routes/ruleRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rules', ruleRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rule Engine AI Server Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
