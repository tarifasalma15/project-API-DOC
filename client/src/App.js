import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { GoogleOAuthProvider } from '@react-oauth/google';


import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Message';
import Settings from './pages/Settings';
import Appointments from './pages/Appointment';
import BookAppointment from './pages/BookAppointment';
import EditAppointment from './pages/EditAppointment';
import Notifications from './pages/Notifications';
import AppointmentDetails from './pages/AppointmentDetails'; // Import the new component


const clientId = "679022050996-2ig8hertalm6vodug29iv9slussvor7o.apps.googleusercontent.com";

const App = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      });
    };
    gapi.load('client:auth2', start);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/edit-appointment/:appointmentId" element={<EditAppointment />} />
          <Route path="/notifications" element={<Notifications />} /> 
          <Route path="/appointment-details/:id" element={<AppointmentDetails />} /> {/* Add the new route */}

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
