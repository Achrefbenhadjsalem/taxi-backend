// config.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('taxiapplication', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
