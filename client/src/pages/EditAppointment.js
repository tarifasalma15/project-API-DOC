import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const EditAppointment = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const getAppointmentDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/appointments/${appointmentId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        setAppointment(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error fetching appointment details', error);
      message.error('Error fetching appointment details');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const res = await axios.put(`/api/v1/appointments/update/${appointmentId}`, values, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (res.data.success) {
        message.success('Appointment updated successfully');
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error updating appointment', error);
      message.error('Error updating appointment');
    }
  };

  useEffect(() => {
    getAppointmentDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={{ 
        date: moment(appointment.date), 
        time: moment(appointment.time, 'HH:mm'),
        description: appointment.description 
      }}>
      <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date' }]}>
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="Time" name="time" rules={[{ required: true, message: 'Please select a time' }]}>
        <TimePicker format="HH:mm" />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
        <Input.TextArea />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Update
      </Button>
    </Form>
  );
};

export default EditAppointment;
