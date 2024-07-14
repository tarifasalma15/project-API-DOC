import React from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 
import '../styles/RegisterStyles.css';

const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";

const Register = () => {
  const navigate = useNavigate();

  const onfinishHandler = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/register', values);
      if (res.data.success) {
        message.success('Register successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const onSuccess = async (response) => {
    const userProfile = jwtDecode(response.credential); 
    console.log("Register Success! current User: ", userProfile);

    try {
      const res = await axios.post('/api/v1/user/google-register', {
        email: userProfile.email,
        name: userProfile.name,
      });

      if (res.data.success) {
        message.success('Register successfully');
        localStorage.setItem("token", res.data.token);
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const onError = () => {
    console.log("Register Failed!");
    message.error('Google register failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="form-container">
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
        <Form layout="vertical" onFinish={onfinishHandler} className="register-form">
          <h3 className="text-center">Register Form</h3>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/login" className="ms-2">Already a user? Login here</Link>
          <button className="btn-btn-primary" type="submit">
            Register
          </button>
        </Form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
