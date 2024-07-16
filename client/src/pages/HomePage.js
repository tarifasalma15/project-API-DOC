import React, { useEffect,useState } from 'react';
import { Button, Table , message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeStyles.css';
import background from '../assets/hero-bg.png';




const HomePage = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (user && user.role === 'patient') {
      navigate('/appointments');
    }
  }, [user, navigate]);

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

