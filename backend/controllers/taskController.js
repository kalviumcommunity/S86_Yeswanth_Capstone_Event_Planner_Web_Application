const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ creator: req.userId }).populate('event', 'title date');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { text, category, event } = req.body;
    const task = new Task({
      text,
      category,
      event: event || null,
      creator: req.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { text, completed, category, event } = req.body;
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    if (category !== undefined) task.category = category;
    if (event !== undefined) task.event = event || null;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};
