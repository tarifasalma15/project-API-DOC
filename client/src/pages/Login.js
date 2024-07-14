import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post('/api/v1/user/login', values);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        message.success('Login successfully');
        navigate('/');
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
    <div>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
};

export default Login;
