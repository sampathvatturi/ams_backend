const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getInvoices,
     createInvoice,
     updateInvoice,
     deleteInvoice,
     getInvoice,
     getlastInvoiceNumber
} = require('../controllers/invoices');

router.get('/getInvoices', auth.authenticateToken, getInvoices);
router.post('/createInvoice', auth.authenticateToken, createInvoice);
router.patch('/updateInvoice/:id', auth.authenticateToken, updateInvoice);
router.delete('/deleteInvoice/:id', auth.authenticateToken, deleteInvoice);
router.get('/getInvoice/:id', auth.authenticateToken, getInvoice);
router.get('/getlastInvoiceNumber', auth.authenticateToken, getlastInvoiceNumber);

module.exports = router ;