import React, { useEffect, useState } from 'react';
import { List, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import '../styles/HomeStyles.css';

const HomePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      console.log('Fetching user data');
      const res = await axios.post(
        '/api/v1/user/getUserData',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      console.log('User data fetched', res.data);
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  const getAppointments = async () => {
    try {
      console.log('Fetching appointments');
      const res = await axios.get('/api/v1/appointments', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      console.log('Appointments fetched', res.data);
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
      message.error('Failed to load appointments');
    }
  };

  const getNotifications = async () => {
    try {
      const res = await axios.get('/api/v1/notifications', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
      message.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    getUserData();
    getAppointments();
    getNotifications();

    // Socket.IO event listeners
    socket.on('appointmentCreated', (appointment) => {
      console.log('Appointment created event received', appointment);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `New appointment created: ${appointment.patientName} with Dr. ${appointment.doctorName}`,
      ]);
      setAppointments((prevAppointments) => [...prevAppointments, appointment]);
    });

    socket.on('appointmentUpdated', (appointment) => {
      console.log('Appointment updated event received', appointment);
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
      console.log('Appointment deleted event received', appointmentId);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToNewAppointment = () => {
    navigate('/new-appointment');
  };

  const goToNotifications = () => {
    navigate('/notifications');
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Doctor Appointment System</h1>
      <Button type="primary" onClick={goToNewAppointment} style={{ marginRight: '10px' }}>
        Book a New Appointment
      </Button>
      <Button type="default" onClick={goToNotifications} style={{ marginRight: '10px' }}>
        View Notifications
      </Button>
      <Button type="default" onClick={handleLogout}>
        Logout
      </Button>

      <div className="list-container">
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
      </div>

      <div className="notifications-container">
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
    </div>
  );
};

export default HomePage;
