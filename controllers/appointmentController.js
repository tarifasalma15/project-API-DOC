const Appointment = require('../models/bookAppointmentModels');
const User = require('../models/userModels');

const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, date, time, description } = req.body;
    const userId = req.body.userId;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).send({ success: false, message: 'Doctor not found' });
    }

    const newAppointment = new Appointment({
      doctorId,
      userId,
      date,
      time,
      description,
    });

    await newAppointment.save();

    res.status(201).send({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error booking appointment' });
  }
};



module.exports = { bookAppointmentController };
