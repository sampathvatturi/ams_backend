const express = require('express');
const router = express.Router();

const{ 
     getInventory,
     createInventory,
     updateInventory,
     deleteInventory,
     getInventoryitem
} = require('../controllers/inventory');

router.get('/getInventory', getInventory);
router.post('/createInventory', createInventory);
router.patch('/updateInventory/:id', updateInventory);
router.delete('/deleteInventory/:id', deleteInventory);
router.get('/getInventoryitem/:id', getInventoryitem);

module.exports = router ;