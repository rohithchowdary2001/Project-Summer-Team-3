const express = require('express');
const router = express.Router();
const { Book, UserBook, Review, Author, Genre, User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all books with search functionality
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = search ? {
      title: {
        [Op.like]: `%${search}%`
      }
    } : {};

    const books = await Book.findAll({
      where: whereClause,
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] }
        }
      ],
      order: [['title', 'ASC']]
    });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single book with all details
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] }
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get user's specific data for this book
    const userBook = await UserBook.findOne({
      where: {
        userId: req.user.id,
        bookId: req.params.id
      }
    });

    // Add a flag to indicate if the user can edit/delete this book
    const canModify = req.user.role === 'admin' || book.createdBy === req.user.id;

    res.json({
      ...book.toJSON(),
      userStatus: userBook || null,
      canModify
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, coverImage } = req.body;
    let { authors, genres } = req.body;
    
    // Create book
    const book = await Book.create({
      title,
      description,
      coverImage,
      createdBy: req.user.id
    });

    // Parse and add authors if provided
    if (authors) {
      try {
        authors = JSON.parse(authors);
        if (Array.isArray(authors)) {
          await book.setAuthors(authors);
        }
      } catch (err) {
        console.error('Error parsing authors:', err);
      }
    }

    // Parse and add genres if provided
    if (genres) {
      try {
        genres = JSON.parse(genres);
        if (Array.isArray(genres)) {
          await book.setGenres(genres);
        }
      } catch (err) {
        console.error('Error parsing genres:', err);
      }
    }

    // Fetch the book with its associations
    const bookWithAssociations = await Book.findByPk(book.id, {
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json(bookWithAssociations);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's book status
router.post('/:id/status', auth, async (req, res) => {
  try {
    const { readingStatus, readingProgress, hasPhysicalCopy, isWishlisted } = req.body;
    
    const [userBook, created] = await UserBook.findOrCreate({
      where: {
        userId: req.user.id,
        bookId: req.params.id
      },
      defaults: {
        readingStatus: 'not_started',
        readingProgress: 0,
        hasPhysicalCopy: false,
        isWishlisted: false
      }
    });

    await userBook.update({
      readingStatus: readingStatus || userBook.readingStatus,
      readingProgress: readingProgress !== undefined ? readingProgress : userBook.readingProgress,
      hasPhysicalCopy: hasPhysicalCopy !== undefined ? hasPhysicalCopy : userBook.hasPhysicalCopy,
      isWishlisted: isWishlisted !== undefined ? isWishlisted : userBook.isWishlisted
    });

    res.json(userBook);
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const review = await Review.create({
      content: req.body.content,
      userId: req.user.id,
      bookId: req.params.id
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review (Admin only)
router.delete('/:bookId/reviews/:reviewId', [auth, isAdmin], async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (Admin or book creator)
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is admin or book creator
    if (req.user.role !== 'admin' && book.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, description, coverImage } = req.body;
    let { authors, genres } = req.body;

    // Update basic book info
    await book.update({
      title: title || book.title,
      description: description || book.description,
      coverImage: coverImage || book.coverImage
    });

    // Update authors if provided
    if (authors) {
      try {
        authors = JSON.parse(authors);
        if (Array.isArray(authors)) {
          await book.setAuthors(authors);
        }
      } catch (err) {
        console.error('Error parsing authors:', err);
      }
    }

    // Update genres if provided
    if (genres) {
      try {
        genres = JSON.parse(genres);
        if (Array.isArray(genres)) {
          await book.setGenres(genres);
        }
      } catch (err) {
        console.error('Error parsing genres:', err);
      }
    }

    // Fetch the updated book with its associations
    const updatedBook = await Book.findByPk(book.id, {
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] }
        }
      ]
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (Admin or book creator)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is admin or book creator
    if (req.user.role !== 'admin' && book.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 