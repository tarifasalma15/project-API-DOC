import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import '../styles/RegisterStyles.css';
import logo from '../assets/logo.png';
import background from '../assets/hero-bg.png';
import newImage from '../assets/option.png';
import formImage from '../assets/images.jpg';
 
const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";
 
const Login = () => {
  const navigate = useNavigate();
 
  const onfinishHandler = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/login', values);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success('Login successfully');
        navigate('/', { state: { isGoogleLogin: true } });
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
        role: 'user'
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
    <div style={{ background: `url(${background})` }} className="login-background">
      <div className="animation-container">
        <div className="animation-circle animation-circle-1"></div>
        <div className="animation-circle animation-circle-2"></div>
        <div className="animation-circle animation-circle-3"></div>
      </div>
      <GoogleOAuthProvider clientId={clientId}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="form-container"
        >
          <div className="form-image-container">
            <img src={formImage} alt="Form Header" className="form-image" />
            <h3 className="text-on-image">Sign In</h3>
          </div>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
          <Form layout="vertical" onFinish={onfinishHandler} className="register-form">
            <img src={logo} alt="Logo" className="logo" />
            <Form.Item label="Email" name="email">
              <Input type="email" required />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" required />
            </Form.Item>
            <div className="forgot-password-container">
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>
            <Button type="primary" htmlType="submit" className="btn-btn-primary">
              Login
            </Button>
            <img src={newImage} alt="New Image" className="form-new-image" />
            <Link to="/welcome" className="return-link">Return to Welcome Page</Link>
            <Link to="/register" className="ms-2">Not a user? Register here</Link>
          </Form>
        </motion.div>
      </GoogleOAuthProvider>
    </div>
  );
};
 
export default Login;
 