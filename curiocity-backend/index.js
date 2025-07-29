const eventRoutes = require('./routes/events');
const express = require('express');
require('dotenv').config();
const db = require('./config/db'); // Import the db config
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Function to start the server
const startServer = async () => {
  try {
    // Test the database connection
    await db.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database');

    // Start listening for requests only after the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database. Exiting...', err);
    process.exit(1);
  }
};

// Start the application
startServer();