import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Descriptions, Spin, message } from 'antd';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAppointmentDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/v1/appointments/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setAppointment(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointment details', error);
      message.error('Failed to load appointment details');
      setLoading(false);
    }
  
  }, [id]);

  useEffect(() => {
    getAppointmentDetails();
  }, [getAppointmentDetails]);

  if (loading) {
    return <Spin />;
  }

  if (!appointment) {
    return <div>No appointment details found</div>;
  }

  return (
    <Descriptions title="Appointment Details" bordered>
      <Descriptions.Item label="Patient Name">{appointment.patientName}</Descriptions.Item>
      <Descriptions.Item label="Doctor Name">{appointment.doctorName}</Descriptions.Item>
      <Descriptions.Item label="Date">{appointment.date}</Descriptions.Item>
      <Descriptions.Item label="Time">{appointment.time}</Descriptions.Item>
    </Descriptions>
  );
};

export default AppointmentDetails;
