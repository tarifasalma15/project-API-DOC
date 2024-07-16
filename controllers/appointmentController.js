const Appointment = require('../models/bookAppointmentModels');
const users = require('../models/userModels');

const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, date, time, description } = req.body;
    const userId = req.body.userId;

    const doctor = await users.findById(doctorId);
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
    console.log('New appointment:', newAppointment);
    await newAppointment.save();

    res.status(201).send({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error booking appointment' });
  }
};


const getUserAppointmentsController = async (req, res) => {
        try {
          const userId = req.body.userId;
          const user = await users.findById(userId);
      
          if (user.role === 'doctor') {
            // Si l'utilisateur est un docteur, récupérer les rendez-vous où il est le docteur
            const appointments = await Appointment.find({ doctorId: userId }).populate('userId', 'name');
            res.status(200).send({ success: true, data: appointments });
          } else {
            // Sinon, récupérer les rendez-vous où il est le patient
            const appointments = await Appointment.find({ userId }).populate('doctorId', 'name');
            res.status(200).send({ success: true, data: appointments });
          }
        } catch (error) {
          console.log('Error getting appointments:', error);
          res.status(500).send({ success: false, message: 'Error getting appointments' });
        }
      };

module.exports = { bookAppointmentController,  getUserAppointmentsController };
