require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet'); // Helmet for basic security headers
const rateLimit = require('express-rate-limit'); // Rate limiting
const connectDB = require('./dbConnection/dbConnection');
const RealEstateUser = require('./router/RealEstateUser');
const Property = require('./router/Property');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Middlewares
app.use(helmet()); // Set secure HTTP headers
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));

// Prevent brute force attacks by rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
app.use(express.json());

app.use(cookieParser()); // Parse cookies

// 🔗 Routes
app.use('/api/v1/RealEstateUser', RealEstateUser);
app.use('/api/v1/Property', Property);

// 🔌 Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
