const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Favorite, Book, User } = require('../models');

// Get user's favorite books
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Book,
        as: 'favoriteBooks',
        through: { attributes: [] }
      }]
    });
    res.json(user.favoriteBooks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorite books', error: err.message });
  }
});

// Add book to favorites
router.post('/:bookId', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const book = await Book.findByPk(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await user.addFavoriteBook(book);
    res.json({ message: 'Book added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding book to favorites', error: err.message });
  }
});

// Remove book from favorites
router.delete('/:bookId', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const book = await Book.findByPk(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await user.removeFavoriteBook(book);
    res.json({ message: 'Book removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing book from favorites', error: err.message });
  }
});

module.exports = router; 