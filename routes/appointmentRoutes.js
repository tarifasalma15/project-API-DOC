const express = require('express');


const { createAppointment} = require('../controllers/appointmentController');


const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();



router.post('/', authMiddleware, (req, res, next) => {
    console.log('Create appointment route accessed');
    next();
}, createAppointment);


module.exports = router;
