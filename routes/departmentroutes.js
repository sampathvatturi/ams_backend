const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
    getDepartment,
    createdepartment,
    updateDepartment,
    deleteDepartment,
    getDepartments
} = require('../controllers/departments');

router.get('/getDepts', auth.authenticateToken,getDepartments);
router.post('/createDept', auth.authenticateToken,createdepartment);
router.patch('/updateDept/:id', auth.authenticateToken,updateDepartment);
router.delete('/deleteDept/:id', auth.authenticateToken,deleteDepartment);
router.get('/getDept/:id', auth.authenticateToken,getDepartment);

module.exports = router ;