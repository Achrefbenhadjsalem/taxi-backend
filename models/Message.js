const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./User'); // Importer le modèle User

const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Note: The table name is case-sensitive and should match the actual table name
            key: 'id'
        },
        allowNull: false
    },
    receiverId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Message;
