const Appointment = require('../models/bookAppointmentModels');
const users = require('../models/userModels');
const Notification = require('../models/notificationModel');
const { io } = require('../server'); // Import io from server


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



 const getAppointmentDetailsController = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await Appointment.findById(appointmentId).populate('userId doctorId');;
      if (!appointment) {
        return res.status(404).send({ success: false, message: 'Appointment not found' });
      }
      res.status(200).send({ success: true, data: appointment });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error fetching appointment details' });
    }
  };

// Contrôleur pour annuler un rendez-vous
const cancelAppointmentController = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await Appointment.findByIdAndDelete(appointmentId).populate('userId doctorId');
  
      if (!appointment) {
        return res.status(404).send({ success: false, message: 'Appointment not found' });
      }
  
      // Créer des notifications pour le patient et le docteur
      await Notification.create({
        userId: appointment.userId._id,
        message: `Your appointment with Dr. ${appointment.doctorId.name} on ${appointment.date} has been cancelled.`,
      });
      await Notification.create({
        userId: appointment.doctorId._id,
        message: `Your appointment with patient ${appointment.userId.name} on ${appointment.date} has been cancelled.`,
      });
  
      res.status(200).send({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error cancelling appointment' });
    }
  };
  
  // Contrôleur pour modifier un rendez-vous
  const updateAppointmentController = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const updatedData = req.body;
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updatedData, { new: true }).populate('userId doctorId');
  
      if (!updatedAppointment) {
        return res.status(404).send({ success: false, message: 'Appointment not found' });
      }
  
      // Créer des notifications pour le patient et le docteur
      await Notification.create({
        userId: updatedAppointment.userId,
        message: `Your appointment with Dr. ${updatedAppointment.doctorId.name} on ${updatedAppointment.date} has been updated.`,
      });
      await Notification.create({
        userId: updatedAppointment.doctorId,
        message: `Your appointment with patient ${updatedAppointment.userId.name} on ${updatedAppointment.date} has been updated.`,
      });
      res.status(200).send({ success: true, message: 'Appointment updated successfully', data: updatedAppointment });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error updating appointment' });
    }
  };
  
  // Contrôleur pour récupérer les notifications d'un utilisateur
  const getUserNotificationsController = async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.body.userId }).sort({ createdAt: -1 });
      res.status(200).send({ success: true, data: notifications });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Error fetching notifications' });
    }
  };
  // Get appointment by ID
const getAppointment = async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


module.exports = { bookAppointmentController,  getUserAppointmentsController, cancelAppointmentController, updateAppointmentController, getAppointmentDetailsController , getUserNotificationsController, getAppointment };
