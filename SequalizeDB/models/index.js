const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const defineModels = require('./your-schema-file'); // replace with the correct filename

const models = defineModels(sequelize, DataTypes);

module.exports = { sequelize, ...models };
