const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const rateLimit = require('express-rate-limit'); // Import rate-limit
const routes = require('./routes/auth');
const dbConfig = require('./config/db');

const app = express();

// Body parser middleware
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://impactco.ca', 'https://www.impactco.ca'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.set('trust proxy', 1);

// Adjusted Rate Limiting Middleware for a basic website
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, 
  message: 'Too many requests, please try again later.', // Custom message when rate limit exceeded
});

// Apply rate limiting to all API routes
app.use('/api', limiter);

// MongoDB connection
mongoose.connect(dbConfig.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message || err));

// Routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));