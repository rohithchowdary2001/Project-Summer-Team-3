const express = require('express');
const router = express.Router();
const { Author } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all authors
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = search ? {
      name: {
        [Op.like]: `%${search}%`
      }
    } : {};

    const authors = await Author.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new author (Admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    let { name, dob, countryOfBirth, dateOfDeath, bookPublishDate } = req.body;

    // Convert "Invalid date" or empty string to null for date fields
    dob = (!dob || dob === "Invalid date") ? null : dob;
    dateOfDeath = (!dateOfDeath || dateOfDeath === "Invalid date") ? null : dateOfDeath;
    bookPublishDate = (!bookPublishDate || bookPublishDate === "Invalid date") ? null : bookPublishDate;

    const authorExists = await Author.findOne({
      where: { name: { [Op.like]: name } }
    });

    if (authorExists) {
      return res.status(400).json({ message: 'Author already exists' });
    }

    const author = await Author.create({
      name,
      dob,
      countryOfBirth,
      dateOfDeath,
      bookPublishDate,
      createdBy: req.user.id
    });
    res.status(201).json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update author (Admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    let { name, dob, countryOfBirth, dateOfDeath, bookPublishDate } = req.body;

    // Convert "Invalid date" or empty string to null for date fields
    dob = (!dob || dob === "Invalid date") ? null : dob;
    dateOfDeath = (!dateOfDeath || dateOfDeath === "Invalid date") ? null : dateOfDeath;
    bookPublishDate = (!bookPublishDate || bookPublishDate === "Invalid date") ? null : bookPublishDate;

    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.update({
      name,
      dob,
      countryOfBirth,
      dateOfDeath,
      bookPublishDate
    });

    res.json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete author (Admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.destroy();
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 