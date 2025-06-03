const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// Delete review (Admin or owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is admin or review owner
    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 