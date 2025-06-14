const express = require('express');
const router = express.Router();
const { Book, UserBook, Review, Author, Genre, User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { Op } = require('sequelize');
const path = require('path');

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

// Get user's favorite books (MUST come before /:id route)
router.get('/favorites', auth, async (req, res) => {
  try {
    const favoriteUserBooks = await UserBook.findAll({
      where: {
        userId: req.user.id,
        isWishlisted: true
      }
    });

    const bookIds = favoriteUserBooks.map(userBook => userBook.bookId);

    if (bookIds.length === 0) {
      return res.json([]);
    }

    const favoriteBooks = await Book.findAll({
      where: {
        id: bookIds
      },
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

    res.json(favoriteBooks);
  } catch (error) {
    console.error('Error fetching favorite books:', error);
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

    const userBook = await UserBook.findOne({
      where: {
        userId: req.user.id,
        bookId: req.params.id
      }
    });

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

// Upload book cover image
router.post('/upload-cover', [auth, upload.single('coverImage')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Add new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, coverImage, storeLink, publishDate } = req.body;
    let { authors, genres } = req.body;
    
    const book = await Book.create({
      title,
      description,
      coverImage,
      storeLink,
      publishDate, // <-- Save publishDate
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

// Delete review (Admin or review owner)
router.delete('/:bookId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
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

    if (req.user.role !== 'admin' && book.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, description, coverImage, storeLink, publishDate } = req.body;
    let { authors, genres } = req.body;

    await book.update({
      title: title || book.title,
      description: description || book.description,
      coverImage: coverImage || book.coverImage,
      storeLink: storeLink !== undefined ? storeLink : book.storeLink,
      publishDate: publishDate !== undefined ? publishDate : book.publishDate // <-- Save publishDate
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