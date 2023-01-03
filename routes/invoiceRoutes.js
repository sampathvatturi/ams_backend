const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getInvoices,
     createInvoice,
     updateInvoice,
     deleteInvoice,
     getInvoice,
     getVendorInvoices,
     updateInvoiceUserStatus,
     cancelInvoice,
     getInvoiceNumber,
     getInvoicesbyDate
} = require('../controllers/invoices');

router.get('/getInvoices', auth.authenticateToken, getInvoices);
router.post('/createInvoice', auth.authenticateToken, createInvoice);
router.patch('/updateInvoice/:id', auth.authenticateToken, updateInvoice);
router.delete('/deleteInvoice/:id', auth.authenticateToken, deleteInvoice);
router.get('/getInvoice/:id', auth.authenticateToken, getInvoice);
router.get('/getVendorInvoices', auth.authenticateToken, getVendorInvoices);
router.patch('/updateInvoiceUserStatus/:id', auth.authenticateToken, updateInvoiceUserStatus);
router.patch('/cancelInvoice/:id', auth.authenticateToken, cancelInvoice);
router.get('/getInvoiceNumber', auth.authenticateToken, getInvoiceNumber);
router.post('/getInvoicesbyDate', auth.authenticateToken, getInvoicesbyDate);

module.exports = router ;