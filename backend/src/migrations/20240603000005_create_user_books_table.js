'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserBooks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      readingStatus: {
        type: Sequelize.ENUM('not_started', 'in_progress', 'completed'),
        defaultValue: 'not_started'
      },
      readingProgress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100
        }
      },
      hasPhysicalCopy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isWishlisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint to prevent duplicate user-book relationships
    await queryInterface.addIndex('UserBooks', ['userId', 'bookId'], {
      unique: true,
      name: 'unique_user_book_association'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserBooks');
  }
}; 