const express = require('express');
const router = express.Router();

const{ 
     createTables
} = require('../modules/tables');

router.get('/createTables', createTables);

module.exports = router ;