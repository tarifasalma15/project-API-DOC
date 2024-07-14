const express = require('express');
const { createAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
