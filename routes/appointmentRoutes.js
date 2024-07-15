const express = require('express');
const { createAppointment, updateAppointment, deleteAppointment, getAppointments } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, (req, res, next) => {
    console.log('Create appointment route accessed');
    next();
}, createAppointment);

router.put('/:id', authMiddleware, (req, res, next) => {
    console.log('Update appointment route accessed');
    next();
}, updateAppointment);

router.delete('/:id', authMiddleware, (req, res, next) => {
    console.log('Delete appointment route accessed');
    next();
}, deleteAppointment);

router.get('/', authMiddleware, (req, res, next) => {
    console.log('Get appointments route accessed');
    next();
}, getAppointments);

module.exports = router;
