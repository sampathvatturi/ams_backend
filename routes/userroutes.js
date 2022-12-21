const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');
const roleCheck = require('../services/checkrole');

const{ 
     loginUser,
     getUsers,
     createUser,
     updateUser,
     deleteUser,
     getUserById,
     checkToken,
     getUserByDepartmentId,
     getUsersByDepartment
} = require('../controllers/user');

router.post('/login', loginUser);
router.get('/getUsers', auth.authenticateToken, roleCheck.checkRole, getUsers);
router.post('/createUser', auth.authenticateToken, createUser);
router.patch('/updateUser/:id', auth.authenticateToken, updateUser);
router.delete('/deleteUser/:id', auth.authenticateToken, deleteUser);
router.get('/getUserById/:id', auth.authenticateToken, getUserById);
router.get('/checkToken', checkToken);
router.post('/getUserByDepartmentId', auth.authenticateToken, getUserByDepartmentId);
router.get('/getUsersByDepartment', auth.authenticateToken, getUsersByDepartment);

module.exports = router ;