import React, { useEffect,useState } from 'react';
import { Button, Table , message } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/HomeStyles.css';
import background from '../assets/hero-bg.png';




const HomePage = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


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
      
      console.log('User data fetched', res.data);
      setUser(res.data.data);
     
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };
  const getUserAppointments = async () => {
    try {
      const res = await axios.get('/api/v1/appointments/userAppointments', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error fetching appointments', error);
      message.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
    getUserAppointments();
  }, []);

  
  useEffect(() => {
    const isGoogleLogin = location.state && location.state.isGoogleLogin;
    if (user && user.role === 'patient' && isGoogleLogin) {
      navigate('/');
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    console.log('User state updated', user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleAppointments = () => {
    navigate('/appointments');
  };
  
  const handleMessages = () => {
    navigate('/messages');
  };

  const handleSettings = () => {
    navigate('/settings');
  };
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await axios.delete(`/api/v1/appointments/cancel/${appointmentId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        message.success('Appointment cancelled successfully');
        getUserAppointments(); // Refresh the appointments list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error cancelling appointment', error);
      message.error('Error cancelling appointment');
    }
  };

  const handleEditAppointment = (appointmentId) => {
    navigate(`/edit-appointment/${appointmentId}`);
  };
  const columns = [
    {
      title: user && user.role === 'doctor' ? 'Patient' : 'Doctor',
      dataIndex: user && user.role === 'doctor' ? ['userId', 'name'] : ['doctorId', 'name'],
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEditAppointment(record._id)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleCancelAppointment(record._id)} danger>Cancel</Button>
        </span>
      ),
    },
  
  ];
  return (
  
    <div className="home-container" style={{ backgroundImage: `url(${background})`}}>
      <h1>Medicare</h1>
      {user ? (
        <h2>
          Hello, {user.role === 'doctor' ? 'Doctor' : 'Patient'} {user.name}
        </h2>
      ) : (
        <h2>Loading user data...</h2>
      )}
      <div className="home-buttons">
        <Button type="default" className='logout-button'onClick={handleLogout}>
          Logout
        </Button>
        <Button type="primary" onClick={handleProfile}>
          Profile
        </Button>
        <Button type="primary" onClick={handleAppointments}>
          Appointments with doctors
        </Button>
        <Button type="primary" onClick={handleMessages}>
            Messages
          </Button>
          <Button type="primary" onClick={handleSettings}>
            Settings
          </Button>
      </div>
      <h2>My Appointments</h2>
      <Table dataSource={appointments} columns={columns} rowKey="_id" loading={loading} />
    </div>
  );
};

export default HomePage;

