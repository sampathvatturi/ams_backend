const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getAccountHeads,
    createAccountHead,
    updateAccountHead
} = require('../controllers/accountheads');

router.get('/getAccountHeads', auth.authenticateToken,getAccountHeads);
router.post('/createAccountHead', auth.authenticateToken,createAccountHead);
router.patch('/updateAccountHead/:id', auth.authenticateToken,updateAccountHead);

module.exports = router ;