const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  countryOfBirth: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateOfDeath: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  bookPublishDate: {
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

module.exports = Author;