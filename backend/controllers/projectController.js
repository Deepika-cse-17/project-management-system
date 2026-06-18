const { Project, Task } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const { search, status } = req.query;
  const where = { user_id: req.user.id };
  if (status && status !== 'All') where.status = status;
  if (search) where.project_name = { [Op.like]: `%${search}%` };

  const projects = await Project.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(projects);
};

exports.getOne = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

exports.create = async (req, res) => {
  const { project_name, description, status, start_date, end_date } = req.body;
  const project = await Project.create({ project_name, description, status, start_date, end_date, user_id: req.user.id });
  res.status(201).json(project);
};

exports.update = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.update(req.body);
  res.json(project);
};

exports.remove = async (req, res) => {
  const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await project.destroy();
  res.json({ message: 'Project deleted' });
};