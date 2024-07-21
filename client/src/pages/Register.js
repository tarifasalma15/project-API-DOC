import React, { useState } from "react";
import { Form, Input, message, Radio } from 'antd';
import '../styles/RegisterStyles.css';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import background from '../assets/hero-bg.png';

const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";

const Register = () => {
  const [role, setRole] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();

  const onfinishHandler = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/register', { ...values, role });
      if (res.data.success) {
        message.success(`Register Successfully!`);
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
    console.log("Google User Profile:", userProfile);
    setGoogleUser(userProfile);
  };

  const onError = () => {
    console.log("Google Register Failed!");
    message.error('Google register failed');
  };

  const handleGoogleRegister = async () => {
    if (!role) {
      message.error('Please select a role');
      return;
    }

    try {
      const res = await axios.post('/api/v1/user/google-register', {
        email: googleUser.email,
        name: googleUser.name,
        role: role,
      });

      if (res.data.success) {
        message.success('Register successfully');
        localStorage.setItem("token", res.data.token);
        navigate('/', { state: { isGoogleLogin: true } });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <div style={{ background: `url(${background})` }}>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="form-container">
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
          {googleUser && (
            <div className="role-selection">
              <h3>Select Role</h3>
              <Radio.Group onChange={(e) => setRole(e.target.value)} required>
                <Radio value="patient">Patient</Radio>
                <Radio value="doctor">Doctor</Radio>
              </Radio.Group>
              <button className="btn-btn-primary" onClick={handleGoogleRegister}>
                Continue
              </button>
            </div>
          )}
          {!googleUser && (
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
              <Form.Item label="Role" name="role">
                <Radio.Group onChange={(e) => setRole(e.target.value)} required>
                  <Radio value="patient">Patient</Radio>
                  <Radio value="doctor">Doctor</Radio>
                </Radio.Group>
              </Form.Item>
              <Link to="/login" className="ms-2">Already a user? Login here</Link>
              <button className="btn-btn-primary" type="submit">
                Register
              </button>
            </Form>
          )}
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Register;
