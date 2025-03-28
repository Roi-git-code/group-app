const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  console.log('🔵 [Auth] Registration attempt:', req.body.email);
  
  try {
    const { firstName, middleName, lastName, email, password } = req.body;

    // 🛡️ Validation Layer
    const errors = [];
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (password?.length < 6) errors.push('Password must be at least 6 characters');

    if (errors.length > 0) {
      console.warn('🟠 [Auth] Validation failed:', errors);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }

    // 📦 Data Preparation
    const userData = {
      firstName: firstName.trim(),
      middleName: middleName?.trim() || null,
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 10)
    };

    // 🔍 Duplicate Check
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      console.warn('🟠 [Auth] Duplicate email:', userData.email);
      return res.status(409).json({
        success: false,
        message: 'Registration failed',
        errors: ['Email already registered']
      });
    }

    // 💾 Database Operation
    const userId = await User.create(userData);
    console.log('🟢 [Auth] Registration success:', userData.email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: { userId }
    });

  } catch (error) {
    console.error('🔴 [Auth] Critical error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};
