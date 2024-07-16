const express = require('express');
const { bookAppointmentController ,  getUserAppointmentsController} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookAppointmentController);
router.get('/userAppointments', authMiddleware, getUserAppointmentsController); // Nouvelle route

module.exports = router;
