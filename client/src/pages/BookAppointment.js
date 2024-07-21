import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, message, Spin } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookAppointmentStyles.css';
import moment from 'moment';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/user/getDoctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDoctor(response.data.doctor);
      } catch (error) {
        message.error('Error fetching doctor details');
      } finally {
        setLoading(false);
      }
    };

    getDoctorDetails();
  }, [doctorId]);

  const onFinish = async (values) => {
    try {
      const { date, time, ...rest } = values;
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const formattedTime = moment(time).format('HH:mm');
  
      const res = await axios.post('/api/v1/appointments/book', 
        { ...rest, date: formattedDate, time: formattedTime, doctorId },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (res.data.success) {
        message.success('Appointment booked successfully');
        form.resetFields();
        navigate('/');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      message.error('Failed to book appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };
  const handleReturnHome = () => {
    navigate('/appointments');
  };


  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="book-appointment-container">
        <button className="return-button" onClick={handleReturnHome}>
        Return
      </button>
      <Button type="default" onClick={goToHome} style={{ marginRight: '10px' }}>
        Home
      </Button>
      <Button type="default" onClick={handleLogout}>
        Logout
      </Button>
      <h1>Book Appointment with Dr. {doctor.name}</h1>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '20px' }}>
        <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select the date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Time" name="time" rules={[{ required: true, message: 'Please select the time!' }]}>
          <TimePicker format="HH:mm"  />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please add a description!' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookAppointment;
