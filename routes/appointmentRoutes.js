const express = require('express');
const { bookAppointmentController ,  getUserAppointmentsController , cancelAppointmentController, getAppointmentDetailsController,  getUserNotificationsController,

    updateAppointmentController } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', authMiddleware, bookAppointmentController);
router.get('/userAppointments', authMiddleware, getUserAppointmentsController); 
router.delete('/cancel/:appointmentId', authMiddleware, cancelAppointmentController); 
router.put('/update/:appointmentId', authMiddleware, updateAppointmentController);
router.get('/:appointmentId', authMiddleware, getAppointmentDetailsController); 
router.get('/userNotifications', authMiddleware, getUserNotificationsController);


module.exports = router;
