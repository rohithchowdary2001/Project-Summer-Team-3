const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// Get all users (Admin only)
router.delete('/users/:id', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy({ force: true }); // hard delete
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;