const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Review, Book, User } = require('../models');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: Book,
          attributes: ['id', 'title', 'author']
        }
      ]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Get reviews by book ID
router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { book_id: req.params.bookId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Get reviews by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author']
        }
      ]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Create new review
router.post('/', auth, async (req, res) => {
  try {
    const { book_id, review_text, rating, read_date } = req.body;
    const user_id = req.user.id;

    const review = await Review.create({
      user_id,
      book_id,
      review_text,
      rating,
      read_date
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
});

// Update review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { review_text, rating, read_date } = req.body;
    await review.update({
      review_text: review_text || review.review_text,
      rating: rating || review.rating,
      read_date: read_date || review.read_date
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
});

module.exports = router; 