const { sequelize, createDatabase } = require('./config/database');
const { DataTypes } = require('sequelize');
const defineModels = require('./models/book-management-schema');

async function setup() {
  try {
    await createDatabase(); // ✅ Creates DB if not exists
    console.log('✅ Database ensured');

    const models = defineModels(sequelize, DataTypes);
    await sequelize.sync({ alter: true }); // Creates tables
    console.log('✅ Tables created');

    await sequelize.close();
  } catch (err) {
    console.error('❌ Error setting up the DB:', err);
  }
}

setup();
