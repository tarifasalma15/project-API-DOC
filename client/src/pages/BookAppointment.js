import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, DatePicker, TimePicker, message, Spin } from 'antd';
import moment from 'moment';
import '../styles/BookAppointmentStyles.css';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    try {
      const { date, time, ...rest } = values;

      const momentDate = moment.isMoment(date) ? date : moment(date);
      const momentTime = moment.isMoment(time) ? time : moment(time);

      if (!momentDate.isValid() || !momentTime.isValid()) {
        throw new Error('Date or Time is not a valid moment object');
      }
      const formattedDate = momentDate.format('YYYY-MM-DD');
      const formattedTime = momentTime.format('HH:mm');

      const response = await axios.post('/api/v1/appointments', 
        { ...rest, date: formattedDate, time: formattedTime },
        {
          doctorId,
          date: formattedDate,
          time: formattedTime,
          ...rest,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        message.success('Appointment booked successfully');
        navigate(-1); // Navigate to the previous page
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="book-appointment-container">
      <Button className="return-button" onClick={handleReturnHome}>
        Return
      </Button>
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
          <Button type="primary" htmlType="submit" loading={submitting}>
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookAppointment;
