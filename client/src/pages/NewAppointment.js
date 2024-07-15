import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styles/NewAppointment.css';

const NewAppointment = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { date, time, ...rest } = values;
      const formattedDate = date.format('YYYY-MM-DD');
      const formattedTime = time.format('HH:mm');
      const res = await axios.post('/api/v1/appointments', 
        { ...rest, date: formattedDate, time: formattedTime },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (res.status === 201) { 
        message.success('Appointment created successfully');
        navigate('/');
      } 
      
    } catch (error) {
      console.error(error);
      message.error('Failed to create appointment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  


  return (
    <div className="new-appointment-container">
      <h1>Create New Appointment</h1>
      <Button type="default" onClick={goToHome} style={{ marginRight: '10px' }}>
        Home
      </Button>
      <Button type="default" onClick={handleLogout}>
        Logout
      </Button>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Patient Name" name="patientName" rules={[{ required: true, message: 'Please input the patient name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Doctor Name" name="doctorName" rules={[{ required: true, message: 'Please input the doctor name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select the date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Time" name="time" rules={[{ required: true, message: 'Please select the time!' }]}>
          <TimePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Appointment
          </Button>
        </Form.Item>
      </Form>
     
    </div>
  );
};

export default NewAppointment;