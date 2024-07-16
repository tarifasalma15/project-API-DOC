import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AppointmentsStyles.css';
import { useNavigate } from 'react-router-dom';



const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
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
      console.log('User data:', res.data.data); // Log user data

    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  const getDoctors = async () => {
    try {
        const res = await axios.get('/api/v1/user/getAllDoctors', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        setDoctors(res.data.doctors);
        console.log('Doctors data:', res.data.doctors); 
      } catch (error) {
        console.log('Error fetching doctors', error);
      }
    };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user && user.role === 'patient') {
      getDoctors();
    }
  }, [user]);

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="appointments-container">
      <button className="return-button" onClick={handleReturnHome}>
        Return
      </button>
      <h1>Appointments</h1>
      {user.role === 'patient' && (
        <div>
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>
                    <button onClick={() => handleBookAppointment(doctor._id)}>
                      Available Doctor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



export default Appointments;
