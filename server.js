const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/user', (req, res, next) => {
    console.log('User route accessed');
    next();
}, require('./routes/userRoutes'));

app.use('/api/v1/appointments', (req, res, next) => {
    console.log('Appointments route accessed');
    next();
}, require('./routes/appointmentRoutes'));

// port
const port = process.env.PORT || 8080;

// create server
const server = http.createServer(app);

// initialize socket.io
const io = socketIo(server);

// Export io for use in controllers
module.exports.io = io;

// handle socket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle appointment created
    socket.on('appointmentCreated', (appointment) => {
        console.log('Appointment created: ', appointment);
        // Broadcast the appointment to all clients
        io.emit('appointmentCreated', appointment);
    });

    // Handle appointment updated
    socket.on('appointmentUpdated', (appointment) => {
        console.log('Appointment updated: ', appointment);
        // Broadcast the appointment to all clients
        io.emit('appointmentUpdated', appointment);
    });

    // Handle appointment deleted
    socket.on('appointmentDeleted', (appointmentId) => {
        console.log('Appointment deleted: ', appointmentId);
        // Broadcast the deletion to all clients
        io.emit('appointmentDeleted', appointmentId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// listen port
server.listen(port, () => {
    console.log(`server running in ${process.env.NODE_ENV} MODE ON PORT ${port}`.bgCyan.white);
});
