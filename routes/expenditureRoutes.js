const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    createExpense,
    cancelExpense
} = require('../controllers/expenditures');

router.get('/getExpenses', auth.authenticateToken, getExpenses);
router.post('/createExpense', auth.authenticateToken, createExpense);
router.patch('/updateExpense/:id', auth.authenticateToken, updateExpense);
router.delete('/deleteExpense/:id', auth.authenticateToken, deleteExpense);
router.get('/getExpense/:id', auth.authenticateToken, getExpense);
router.patch('/cancelExpense/:id', auth.authenticateToken, cancelExpense);

module.exports = router ;