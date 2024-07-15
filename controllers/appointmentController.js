const Appointment = require('../models/appointmentModel');
const { io } = require('../server'); 

// Create appointment
const createAppointment = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    const { patientName, doctorName, date, time } = req.body;
    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newAppointment = new Appointment({ patientName, doctorName, date, time });
    await newAppointment.save();
    console.log('New appointment created:', newAppointment);
    io.emit('appointmentCreated', newAppointment); // Emit event
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error); // Log the error
    res.status(500).send({ message: 'Internal Server Error' });
  }
};



module.exports = { createAppointment };
