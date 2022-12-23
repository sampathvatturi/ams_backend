const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getMenu
} = require('../controllers/menu');

router.get('/getMenu', getMenu);

module.exports = router ;