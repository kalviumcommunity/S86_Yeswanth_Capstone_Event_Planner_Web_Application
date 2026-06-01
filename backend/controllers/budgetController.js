const Expense = require('../models/Expense');
const User = require('../models/User');

exports.getBudget = async (req, res) => {
  try {
    const expenses = await Expense.find({ creator: req.userId }).populate('event', 'title date');
    const user = await User.findById(req.userId);
    res.json({ expenses, budgetLimit: user ? user.budgetLimit : 2000 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve budget info', error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { name, amount, category, event } = req.body;
    const expense = new Expense({
      name,
      amount,
      category,
      event: event || null,
      creator: req.userId
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense', error: err.message });
  }
};

exports.updateLimit = async (req, res) => {
  try {
    const { limit } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { budgetLimit: limit }, { new: true });
    res.json({ budgetLimit: user.budgetLimit });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update budget limit', error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
};
