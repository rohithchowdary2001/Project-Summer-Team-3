'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Authors', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Authors', 'countryOfBirth', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Authors', 'dateOfDeath', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('Authors', 'bookPublishDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Authors', 'dob');
    await queryInterface.removeColumn('Authors', 'countryOfBirth');
    await queryInterface.removeColumn('Authors', 'dateOfDeath');
    await queryInterface.removeColumn('Authors', 'bookPublishDate');
  }
};