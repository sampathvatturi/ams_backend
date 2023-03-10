const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getTransactions,
    createTransaction,
    getTransactionsCount,
    getTrailBalance,
    addCashAdjustment
} = require('../controllers/transactions');

router.post('/getTransactions', getTransactions);
router.post('/createTransaction', auth.authenticateToken, createTransaction);
router.post('/getTransactionsCount', auth.authenticateToken, getTransactionsCount);
router.get('/getTrailBalance', auth.authenticateToken, getTrailBalance);
router.post('/addCashAdjustment', auth.authenticateToken, addCashAdjustment);

module.exports = router ;