const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getFunds,
    createFund,
    updateFund,
    getFund
} = require('../controllers/funds');

router.get('/getFunds', auth.authenticateToken, getFunds);
router.post('/createFund', auth.authenticateToken, createFund);
router.patch('/updateFund/:id', auth.authenticateToken, updateFund);
router.get('/getFund/:id', auth.authenticateToken, getFund);

module.exports = router ;