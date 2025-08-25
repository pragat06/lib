// File: backend/index.js

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI, { /* ... options ... */ })
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Hello from the DLMS Backend!');
});

// THIS LINE CONNECTS YOUR ROUTES
app.use('/api/auth', require('./routes/auth'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is successfully running on port: ${PORT}`);
});