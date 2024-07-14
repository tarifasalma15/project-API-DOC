import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, List, message } from 'antd';
import axios from 'axios';
import socket from '../socket';
import '../styles/HomeStyles.css';

const HomePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        '/api/v1/user/getUserData',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAppointments = async () => {
    try {
      const res = await axios.get('/api/v1/appointments', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load appointments');
    }
  };

  useEffect(() => {
    getUserData();
    getAppointments();

    // Socket.IO event listeners
    socket.on('appointmentCreated', (appointment) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `New appointment created: ${appointment.patientName} with Dr. ${appointment.doctorName}`,
      ]);
      setAppointments((prevAppointments) => [...prevAppointments, appointment]);
    });

    socket.on('appointmentUpdated', (appointment) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Appointment updated: ${appointment.patientName} with Dr. ${appointment.doctorName}`,
      ]);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointment._id ? appointment : appt
        )
      );
    });

    socket.on('appointmentDeleted', (appointmentId) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `Appointment deleted with ID: ${appointmentId}`,
      ]);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== appointmentId)
      );
    });

    // Cleanup event listeners on component unmount
    return () => {
      socket.off('appointmentCreated');
      socket.off('appointmentUpdated');
      socket.off('appointmentDeleted');
    };
  }, []);

  const handleNewAppointment = () => {
    navigate('/new-appointment');
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Doctor Appointment System</h1>
      {user && <h2>Hello, {user.name}</h2>}
      <Button type="primary" onClick={handleNewAppointment}>
        Book a New Appointment
      </Button>

      <h2>Your Appointments</h2>
      <List
        itemLayout="horizontal"
        dataSource={appointments}
        renderItem={(appointment) => (
          <List.Item>
            <List.Item.Meta
              title={`${appointment.patientName} with Dr. ${appointment.doctorName}`}
              description={`${appointment.date} at ${appointment.time}`}
            />
          </List.Item>
        )}
      />

      <h2>Notifications</h2>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(notification, index) => (
          <List.Item key={index}>
            <List.Item.Meta description={notification} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default HomePage;
