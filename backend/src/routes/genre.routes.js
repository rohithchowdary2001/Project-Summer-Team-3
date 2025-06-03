const express = require('express');
const router = express.Router();
const { Genre } = require('../models');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all genres
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = search ? {
      name: {
        [Op.like]: `%${search}%`
      }
    } : {};

    const genres = await Genre.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    res.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new genre (Admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { name } = req.body;
    
    const genreExists = await Genre.findOne({
      where: { name: { [Op.like]: name } }
    });

    if (genreExists) {
      return res.status(400).json({ message: 'Genre already exists' });
    }

    const genre = await Genre.create({
      name,
      createdBy: req.user.id
    });
    res.status(201).json(genre);
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update genre (Admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const { name } = req.body;
    const genre = await Genre.findByPk(req.params.id);
    
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    await genre.update({ name });
    res.json(genre);
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete genre (Admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    await genre.destroy();
    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 