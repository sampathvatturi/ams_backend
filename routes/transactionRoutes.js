const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getTransactions,
    createTransaction,
} = require('../controllers/transactions');

router.post('/getTransactions', getTransactions);
router.post('/createTransaction', auth.authenticateToken, createTransaction);

module.exports = router ;