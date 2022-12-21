const express = require('express');
const router = express.Router();

const{ 
     getUoms,
     createUom,
     updateUom
} = require('../controllers/uom');

router.get('/getUoms', getUoms);
router.post('/createUom', createUom);
router.patch('/updateUom/:id', updateUom);

module.exports = router ;