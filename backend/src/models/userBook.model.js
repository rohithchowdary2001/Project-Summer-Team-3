const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserBook = sequelize.define('UserBook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  },
  readingStatus: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  readingProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  hasPhysicalCopy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isWishlisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Define associations in a separate function to avoid circular dependencies
UserBook.associate = (models) => {
  UserBook.belongsTo(models.User, {
    foreignKey: 'userId'
  });
  UserBook.belongsTo(models.Book, {
    foreignKey: 'bookId'
  });
};

module.exports = UserBook; 