'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create BookAuthors join table
    await queryInterface.createTable('BookAuthors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Authors',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    // Create BookGenres join table
    await queryInterface.createTable('BookGenres', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genres',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    // Add unique constraints to prevent duplicate associations
    await queryInterface.addIndex('BookAuthors', ['bookId', 'authorId'], {
      unique: true,
      name: 'unique_book_author_association'
    });
    await queryInterface.addIndex('BookGenres', ['bookId', 'genreId'], {
      unique: true,
      name: 'unique_book_genre_association'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookAuthors');
    await queryInterface.dropTable('BookGenres');
  }
}; 