import React, { useEffect,useState } from 'react';
import { Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeStyles.css';
import background from '../assets/hero-bg.png';




const HomePage = () => {
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
      
      console.log('User data fetched', res.data);
      setUser(res.data.data);
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
          Appointments
        </Button>
        <Button type="primary" onClick={handleMessages}>
            Messages
          </Button>
          <Button type="primary" onClick={handleSettings}>
            Settings
          </Button>
      </div>
    </div>
  );
};

export default HomePage;

