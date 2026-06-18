const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  full_name: { type: DataTypes.STRING, allowNull: false },
  email:     { type: DataTypes.STRING, allowNull: false, unique: true },
  password:  { type: DataTypes.STRING, allowNull: false },
  password_reset_token: { type: DataTypes.STRING, allowNull: true },
  password_reset_expires: { type: DataTypes.DATE, allowNull: true },
});

module.exports = User;