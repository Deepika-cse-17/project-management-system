const { Task, Project } = require('../models');
const { Op } = require('sequelize');

// Helper: check project belongs to user
const userOwnsProject = async (project_id, user_id) => {
  return await Project.findOne({ where: { id: project_id, user_id } });
};

exports.getAll = async (req, res) => {
  const { search, status, priority, project_id } = req.query;
  const where = {};
  if (project_id) where.project_id = project_id;
  if (status && status !== 'All') where.status = status;
  if (priority && priority !== 'All') where.priority = priority;
  if (search) where.task_name = { [Op.like]: `%${search}%` };

  const tasks = await Task.findAll({
    where,
    include: [{ model: Project, where: { user_id: req.user.id }, attributes: [] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const { task_name, description, priority, status, due_date, project_id } = req.body;
  const project = await userOwnsProject(project_id, req.user.id);
  if (!project) return res.status(403).json({ message: 'Not authorized' });

  const task = await Task.create({ task_name, description, priority, status, due_date, project_id });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id },
    include: [{ model: Project, where: { user_id: req.user.id } }],
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.update(req.body);
  res.json(task);
};

exports.remove = async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id },
    include: [{ model: Project, where: { user_id: req.user.id } }],
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.destroy();
  res.json({ message: 'Task deleted' });
};