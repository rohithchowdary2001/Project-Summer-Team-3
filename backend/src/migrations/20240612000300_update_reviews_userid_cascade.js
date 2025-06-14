// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Remove the old foreign key constraint first
//     await queryInterface.removeConstraint('Reviews', 'reviews_ibfk_1');

//     // Add the new foreign key constraint with ON DELETE CASCADE
//     await queryInterface.addConstraint('Reviews', {
//       fields: ['userId'],
//       type: 'foreign key',
//       name: 'reviews_ibfk_1', // Use the same name as your existing constraint
//       references: {
//         table: 'Users',
//         field: 'id'
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE'
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Remove the CASCADE constraint
//     await queryInterface.removeConstraint('Reviews', 'reviews_ibfk_1');
//     // Optionally, add back the old constraint without CASCADE if needed
//   }
// };



'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the old foreign key constraint if it exists
    try {
      await queryInterface.removeConstraint('Sessions', 'Sessions_userId_Users_fk');
    } catch (err) {
      // Ignore error if constraint does not exist
      console.warn('Constraint Sessions_userId_Users_fk did not exist, skipping removal.');
    }

    // Add the new foreign key constraint WITHOUT onDelete: 'CASCADE'
    await queryInterface.addConstraint('Sessions', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Sessions_userId_Users_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE'
      // No onDelete here!
    });
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('Sessions', 'Sessions_userId_Users_fk');
    } catch (err) {
      console.warn('Constraint Sessions_userId_Users_fk did not exist, skipping removal.');
    }
    // Optionally, add back the old constraint with CASCADE if needed
  }
};