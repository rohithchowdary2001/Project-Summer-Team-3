'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Books', 'storeLink', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Books', 'storeLink', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};