const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  storeLink: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publishDate: {                // <-- Add this block
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

// Define associations in a separate function to avoid circular dependencies
Book.associate = (models) => {
  Book.belongsToMany(models.Author, {
    through: 'BookAuthors',
    as: 'authors'
  });
  
  Book.belongsToMany(models.Genre, {
    through: 'BookGenres',
    as: 'genres'
  });

  Book.belongsToMany(models.User, {
    through: models.UserBook,
    as: 'readers'
  });

  Book.hasMany(models.Review, {
    foreignKey: 'bookId',
    as: 'reviews'
  });
};

module.exports = Book; 