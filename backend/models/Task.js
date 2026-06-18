const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  task_name:   { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  priority:    { type: DataTypes.ENUM('Low', 'Medium', 'High'), defaultValue: 'Medium' },
  status:      { type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'), defaultValue: 'Pending' },
  due_date:    { type: DataTypes.DATEONLY },
});

module.exports = Task;