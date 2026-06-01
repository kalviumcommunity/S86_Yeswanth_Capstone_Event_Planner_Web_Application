const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, budgetController.getBudget);
router.post('/', auth, budgetController.addExpense);
router.put('/limit', auth, budgetController.updateLimit);
router.delete('/:id', auth, budgetController.deleteExpense);

module.exports = router;
