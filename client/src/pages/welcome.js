import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/welcomeStyles.css';
import logo from '../assets/logo.png';
import heroImage from '../assets/mmm.png';
 
const Welcome = () => {
  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <img src={logo} alt="Logo" className="welcome-logo" />
        <nav className="welcome-nav">
         
          <Link to="/login" className="nav-link">
            <FaSignInAlt /> Login
          </Link>
          <Link to="/register" className="nav-link">
            <FaUserPlus /> Register
          </Link>
        </nav>
      </header>
      <main className="welcome-main">
        <div className="welcome-block">
        <div className="welcome-content">
          <h1>MEDICARE <span className="icon">+</span></h1>
          <p className="intro">
            Welcome to Medicare+, your trusted platform for simplifying healthcare management. Our application is designed to make it easy for patients to schedule appointments with healthcare professionals. With Medicare+, you can effortlessly book appointments, manage your health records, and receive timely reminders. Our goal is to enhance your healthcare experience by providing a seamless and user-friendly interface. Join us today and take the hassle out of managing your healthcare appointments with Medicare+.
          </p>
         
        </div>
          <div className="welcome-image">
            <img src={heroImage} alt="Hero" />
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default Welcome;