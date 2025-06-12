const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Session extends Model {
  static associate(models) {
    Session.belongsTo(models.User, { foreignKey: 'userId', });
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loginAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    logoutAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Session'
  }
);

module.exports = Session;