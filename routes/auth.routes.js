const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Use the model instead of direct db
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email exists using User model
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      userId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add this endpoint for user dropdown
// Add this to your existing auth routes
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error('🔴 Failed to fetch users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to load users'
    });
  }
});

module.exports = router;
