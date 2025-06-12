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
    // Remove the old foreign key constraint
    await queryInterface.removeConstraint('Sessions', 'Sessions_userId_Users_fk'); // Use your actual constraint name

    // Add the new foreign key constraint WITHOUT onDelete: 'CASCADE'
    await queryInterface.addConstraint('Sessions', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Sessions_userId_Users_fk', // Use the same or a new name
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE'
      // No onDelete here!
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Sessions', 'Sessions_userId_Users_fk');
    // Optionally, add back the old constraint with CASCADE if needed
  }
};