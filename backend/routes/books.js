const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { Book, Review, User } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all books with reviews
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{
        model: Review,
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      }]
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      }]
    });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book', error: err.message });
  }
});

// Create new book
router.post('/', auth, upload.single('cover_image'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const cover_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const book = await Book.create({
      title,
      author,
      cover_image_url
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

// Update book
router.put('/:id', auth, upload.single('cover_image'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const cover_image_url = req.file ? `/uploads/${req.file.filename}` : book.cover_image_url;

    await book.update({
      title: title || book.title,
      author: author || book.author,
      cover_image_url
    });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error updating book', error: err.message });
  }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book', error: err.message });
  }
});

module.exports = router; 