import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import NewAppointment from './pages/NewAppointment';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './ErrorBoundary';


const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";

const App = () => {
  console.log("Rendering App component");
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
      <ErrorBoundary>
        <Routes>
        
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new-appointment" element={<NewAppointment />} />
        </Routes>
        </ErrorBoundary>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
