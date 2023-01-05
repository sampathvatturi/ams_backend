const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getTransactions,
    createTransaction,
    getTransactionsCount
} = require('../controllers/transactions');

router.post('/getTransactions', getTransactions);
router.post('/createTransaction', auth.authenticateToken, createTransaction);
router.post('/getTransactionsCount', auth.authenticateToken, getTransactionsCount);

module.exports = router ;