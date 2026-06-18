const { Project, Task } = require('../models');

exports.getStats = async (req, res) => {
  const userId = req.user.id;

  const totalProjects      = await Project.count({ where: { user_id: userId } });
  const projectsInProgress = await Project.count({ where: { user_id: userId, status: 'In Progress' } });

  const userProjects = await Project.findAll({ where: { user_id: userId }, attributes: ['id'] });
  const projectIds   = userProjects.map(p => p.id);

  const totalTasks     = await Task.count({ where: { project_id: projectIds } });
  const completedTasks = await Task.count({ where: { project_id: projectIds, status: 'Completed' } });
  const pendingTasks   = await Task.count({ where: { project_id: projectIds, status: 'Pending' } });

  res.json({ totalProjects, totalTasks, completedTasks, pendingTasks, projectsInProgress });
};