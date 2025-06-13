// const express = require('express');
// const router = express.Router();
// const { User, Review } = require('../models');
// const { auth, isAdmin } = require('../middleware/auth.middleware');
// const { Op } = require('sequelize');


// router.get('/', [auth, isAdmin], async (req, res) => {
//   try {
//     const search = req.query.search || '';
//     const where = search
//       ? {
//           [Op.or]: [
//             { username: { [Op.like]: `%${search}%` } },
//             { email: { [Op.like]: `%${search}%` } },
//             { name: { [Op.like]: `%${search}%` } }
//           ]
//         }
//       : {};

//     const users = await User.findAll({
//       where,
//       attributes: { exclude: ['password'] }
//     });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete user (Admin only)
// router.delete('/:id', [auth, isAdmin], async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     await user.destroy();
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get user's reviews
// router.get('/:id/reviews', auth, async (req, res) => {
//   try {
//     const reviews = await Review.findAll({
//       where: { userId: req.params.id }
//     });
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete user's review (Admin only)
// router.delete('/:userId/reviews/:reviewId', [auth, isAdmin], async (req, res) => {
//   try {
//     const review = await Review.findOne({
//       where: {
//         id: req.params.reviewId,
//         userId: req.params.userId
//       }
//     });
    
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
    
//     await review.destroy();
//     res.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router; 



const express = require('express');
const router = express.Router();
const { User, Review } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all users (Admin only)
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const search = req.query.search || '';
    // Only include fields that exist in your User model
    const orConditions = [
      { username: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
    // If your User model has a 'name' field, include this line:
    // orConditions.push({ name: { [Op.like]: `%${search}%` } });

    const where = search
      ? { [Op.or]: orConditions }
      : {};

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error(error); // For debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/:id/reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.id }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user's review (Admin only)
router.delete('/:userId/reviews/:reviewId', [auth, isAdmin], async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.reviewId,
        userId: req.params.userId
      }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;