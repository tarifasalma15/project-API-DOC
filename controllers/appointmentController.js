const Appointment = require('../models/appointmentModel');
const io = require('../server').io; // Assurez-vous que `io` est exporté depuis server.js

// Create appointment
const createAppointment = async (req, res) => {
  try {
    console.log('Creating appointment with data:', req.body);
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    io.emit('appointmentCreated', newAppointment); // Emit event
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('appointmentUpdated', updatedAppointment); // Emit event
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    io.emit('appointmentDeleted', req.params.id); // Emit event
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}); // Vous pouvez filtrer par utilisateur ici
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createAppointment, updateAppointment, deleteAppointment, getAppointments };




