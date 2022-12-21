const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getInvoices,
     createInvoice,
     updateInvoice,
     deleteInvoice,
     getInvoice
} = require('../controllers/invoices');

router.get('/getInvoices', auth.authenticateToken, getInvoices);
router.post('/createInvoice', auth.authenticateToken, createInvoice);
router.patch('/updateInvoice/:id', auth.authenticateToken, updateInvoice);
router.delete('/deleteInvoice/:id', auth.authenticateToken, deleteInvoice);
router.get('/getInvoice/:id', auth.authenticateToken, getInvoice);

module.exports = router ;