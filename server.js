const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors()); // Utilisez le middleware CORS

// routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('appointmentCreated', (appointment) => {
        console.log('Appointment created: ', appointment);
        io.emit('appointmentCreated', appointment);
    });

    socket.on('appointmentUpdated', (appointment) => {
        console.log('Appointment updated: ', appointment);
        io.emit('appointmentUpdated', appointment);
    });

    socket.on('appointmentDeleted', (appointmentId) => {
        console.log('Appointment deleted: ', appointmentId);
        io.emit('appointmentDeleted', appointmentId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// listen port
const port = process.env.PORT || 8080;

server.listen(port, () => {
    console.log(`server running in ${process.env.NODE_ENV} MODE ON PORT ${port}`.bgCyan.white);
});

