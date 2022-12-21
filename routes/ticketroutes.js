const express = require('express');
const router = express.Router();

const{ 
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicket
} = require('../controllers/tickets');

router.get('/getTickets',getTickets);
router.post('/createTicket',createTicket);
router.patch('/updateTicket/:id',updateTicket);
router.delete('/deleteTicket/:id',deleteTicket);
router.get('/getTicket/:id',getTicket);


module.exports = router ;