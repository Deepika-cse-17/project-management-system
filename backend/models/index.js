const User    = require('./User');
const Project = require('./Project');
const Task    = require('./Task');

// A user owns many projects
User.hasMany(Project, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'user_id' });

// A project has many tasks
Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = { User, Project, Task };