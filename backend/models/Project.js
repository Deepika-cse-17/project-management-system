const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  project_name: { type: DataTypes.STRING, allowNull: false },
  description:  { type: DataTypes.TEXT },
  status:       { type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'), defaultValue: 'Not Started' },
  start_date:   { type: DataTypes.DATEONLY },
  end_date:     { type: DataTypes.DATEONLY },
});

module.exports = Project;