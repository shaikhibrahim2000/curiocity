const express = require('express');
const auth = require('../middleware/auth'); // We need auth middleware for creating events
const db = require('../config/db');
const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, start_time, city, address, latitude, longitude, category_id } = req.body;
  const creator_id = req.user.id; // Get user ID from our auth middleware

  // Basic validation
  if (!title || !start_time || !city || !category_id) {
    return res.status(400).json({ msg: 'Please provide title, start time, city, and category' });
  }

  try {
    const newEvent = await db.query(
      'INSERT INTO events (title, description, start_time, city, address, latitude, longitude, creator_id, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description, start_time, city, address, latitude, longitude, creator_id, category_id]
    );
    res.status(201).json(newEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await db.query(
      `SELECT
          e.id, e.title, e.description, e.start_time, e.city, e.address,
          u.username AS creator_name,
          c.name AS category_name
       FROM events e
       JOIN users u ON e.creator_id = u.id
       JOIN categories c ON e.category_id = c.id
       ORDER BY e.start_time ASC`
    );
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;