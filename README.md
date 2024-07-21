# Project Title

Medicare : Doctor appointment system 


## Introduction

Medicare is a comprehensive doctor appointment system designed to facilitate easy booking and management of appointments between patients and doctors. The system allows patients to search for doctors based on specialty, book appointments, and manage their schedules. Doctors can manage their appointments and receive notifications for new appointments. The platform also supports Google OAuth for secure and easy login.


## Features 
User Authentication: Secure login and registration for both doctors and patients, including Google OAuth integration.
Appointment Booking: Patients can book appointments with doctors based on availability.
Appointment Management: Doctors can manage their appointments, update availability, and view patient details.
Notifications: Real-time notifications for appointment booking, updates, and cancellations.

## Technologies Used 

## Frontend
React
Ant Design
Axios
Framer Motion
JWT Decode
Google OAuth

## Backend
Node.js
Express.js
MongoDB
Mongoose
Socket.io
Bcryptjs
JSON Web Token (JWT)
Morgan
CORS

## Prerequisites
Node.js (version 22.4.1)
NPM (version 10.8.1)


## Installation
git clone https://github.com/tarifasalma15/project-API-DOC.git 
cd project-API-DOC 

Install frontend dependencies: cd client
npm install

Install backend dependencies:cd ..
npm install

## Running the Application : 
Start the backend server: npm run server
Start the frontend application:npm run client
Or start both frontend and backend concurrently:npm run dev

## Structure 
project-API-DOC-main/
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Appointment.js
│   │   │   ├── BookAppointment.js
│   │   │   ├── EditAppointment.js
│   │   │   ├── HomePage.js
│   │   │   ├── Login.js
│   │   │   ├── Message.js
│   │   │   ├── Notifications.js
│   │   │   ├── Register.js
│   │   │   ├── Settings.js
│   │   │   ├── welcome.js
│   │   ├── styles/
│   │   │   ├── AppointmentsStyles.css
│   │   │   ├── BookAppointmentStyles.css
│   │   │   ├── HomeStyles.css
│   │   │   ├── Register1.css
│   │   │   ├── RegisterStyles.css
│   │   │   ├── welcomeStyles.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   ├── package.json
│   ├── package-lock.json
├── config/
│   ├── db.js
├── controllers/
│   ├── appointmentController.js
│   ├── userCtrl.js
├── middleware/
├── models/
│   ├── notificationModel.js
│   ├── userModels.js
├── routes/
│   ├── appointmentRoutes.js
│   ├── notificationRoutes.js
│   ├── userRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── README.md
 

 ## Environment variables : 
PORT = 8080
NODE_MODE = development 
DB_URL = mongodb+srv://admin:admin@cluster0.rv1wlgv.mongodb.net/doctorapp
JWT_SECRET = XYZGHSJ123


