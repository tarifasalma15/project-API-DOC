import React from "react";
import {Form, Input, message , Select } from 'antd';
import '../styles/RegisterStyles.css'
import axios from 'axios'
import {Link, useNavigate} from "react-router-dom"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import background from '../assets/hero-bg.png';


const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";
const { Option } = Select;

const Register = () => {
    const navigate = useNavigate()
    //form handler 
    const onfinishHandler= async (values) => {
        try {
            const res = await axios.post('/api/v1/user/register', values )
            if (res.data.success){
                message.success(`Register Successfully!`)
                navigate('/login')
            }else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error)
            message.error('Something went wrong')
        }
    }

    const onSuccess = async (response) => {
      const userProfile = jwtDecode(response.credential); 
      console.log("Register Success! current User: ", userProfile);
  
      try {
        const res = await axios.post('/api/v1/user/google-register', {
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
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
                            <Select>
                                <Option value="patient">Patient</Option>
                                <Option value="doctor">Doctor</Option>
                            </Select>
                        </Form.Item>
            <Link to="/login" className="ms-2">Already a user? Login here</Link>
            <button className="btn-btn-primary" type="submit">
              Register
            </button>
          </Form>
        </div>
      </GoogleOAuthProvider>
      </div>
    );
  };

export default Register;