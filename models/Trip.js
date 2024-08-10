const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./User');

const Trip = sequelize.define('Trip', {
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dropoffLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

module.exports = Trip;
