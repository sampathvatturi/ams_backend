const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getWorks,
     createWork,
     updateWork,
     deleteWork,
     getWork
} = require('../controllers/works');

router.get('/getWorks', auth.authenticateToken, getWorks);
router.post('/createWork', auth.authenticateToken, createWork);
router.patch('/updateWork/:id', auth.authenticateToken, updateWork);
router.delete('/deleteWork/:id', auth.authenticateToken, deleteWork);
router.get('/getWork/:id', auth.authenticateToken, getWork);

module.exports = router ;