const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Define associations in a separate function to avoid circular dependencies
Review.associate = (models) => {
  Review.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  Review.belongsTo(models.Book, {
    foreignKey: 'bookId',
    as: 'book'
  });
};

module.exports = Review; 