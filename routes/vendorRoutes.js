const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getVendorById,
     createVendor,
     updateVendor,
     deleteVendor,
     getVendors,
} = require('../controllers/vendors');

router.get('/getVendors', auth.authenticateToken, getVendors);
router.post('/createVendor', auth.authenticateToken, createVendor);
router.patch('/updateVendor/:id', auth.authenticateToken, updateVendor);
router.delete('/deleteVendor/:id', auth.authenticateToken, deleteVendor);
router.get('/getVendorById/:id', auth.authenticateToken, getVendorById);

module.exports = router ;