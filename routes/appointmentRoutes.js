const express = require('express');
const { bookAppointmentController } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookAppointmentController);

module.exports = router;
