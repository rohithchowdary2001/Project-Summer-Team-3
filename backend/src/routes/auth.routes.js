const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');
const adminConfig = require('../config/admin.config');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, isAdmin, adminCode } = req.body;
    
    // Check if user is requesting admin role
    if (isAdmin) {
      if (!adminCode) {
        return res.status(400).json({ message: 'Admin code is required for admin registration' });
      }
      if (adminCode !== adminConfig.ADMIN_REGISTRATION_CODE) {
        return res.status(401).json({ message: 'Invalid admin code' });
      }
    }

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: isAdmin ? 'admin' : 'user'
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get previous login time before updating
    const previousLoginAt = user.lastLoginAt;

    // Update last login time
    await user.update({ lastLoginAt: new Date() });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLoginAt: previousLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 