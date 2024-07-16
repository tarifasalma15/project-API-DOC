import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, DatePicker, TimePicker, message } from 'antd';
import '../styles/BookAppointmentStyles.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/user/getDoctor/${doctorId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        setDoctor(res.data.doctor);
      } catch (error) {
        console.log('Error fetching doctor details', error);
      }
    };
    getDoctorDetails();
  }, [doctorId]);

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        '/api/v1/appointments/book',
        {
          doctorId,
          date: values.date.format('YYYY-MM-DD'),
          time: values.time.format('HH:mm'),
          description: values.description,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (res.data.success) {
        message.success('Appointment booked successfully');
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log('Error booking appointment', error);
      message.error('Error booking appointment');
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (!doctor) {
    return <div>Loading doctor details...</div>;
  }

  return (
    <div className="book-appointment-container">
      <button className="return-button" onClick={handleReturnHome}>
        Return
      </button>
      <h1>Book Appointment</h1>
      <p>Booking appointment with Dr. {doctor.name}</p>
      <Form
        name="book_appointment"
        onFinish={onFinish}
        layout="vertical"
        className="book-appointment-form"
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time"
          rules={[{ required: true, message: 'Please select a time' }]}
        >
          <TimePicker use12Hours format="h:mm a" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please add a description' }]}
        >
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
