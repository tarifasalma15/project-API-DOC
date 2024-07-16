import React from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../styles/RegisterStyles.css';
import logo from '../assets/logo.png'; 
import background from '../assets/hero-bg.png';
import { jwtDecode } from 'jwt-decode';

const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();

  const onfinishHandler = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/login', values);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success('Login successfully');
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('something went wrong');
    }
  };

  const onSuccess = async (response) => {
    const userProfile = jwtDecode(response.credential); 
    console.log("Login Success! current User: ", userProfile);

    try {
      const res = await axios.post('/api/v1/user/google-login', {
        email: userProfile.email,
        name: userProfile.name,
      });

      if (res.data.success) {
        message.success('Login successfully');
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
    console.log("Login Failed!");
    message.error('Google login failed');
  };

  return (
    <div  style={{ background: `url(${background})`}}>
    <GoogleOAuthProvider clientId={clientId}>
      <div className="form-container">
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
        <Form layout="vertical" onFinish={onfinishHandler} className="register-form">
        <img src={logo} alt="Logo" className="logo" />
          <h3 className="text-center">Login Form</h3>

          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/register" className="ms-2">Not a user? Register here</Link>
          <button className="btn-btn-primary" type="submit">
            Login
          </button>
        </Form>
      </div>
    </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
