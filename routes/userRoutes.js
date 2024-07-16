const express = require('express');


const {
  loginController,
  registerController,
  authController,
  googleLoginController,
  googleRegisterController,
  getAllDoctorsController ,
  getDoctorController
} = require("../controllers/userCtrl");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const appointmentRoutes = require('./appointmentRoutes');

// Routes
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/google-login', googleLoginController);
router.post('/google-register', googleRegisterController); 
router.post('/getUserData', authMiddleware, authController);
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);
router.get('/getDoctor/:id', authMiddleware, getDoctorController);

router.use('/appointments', appointmentRoutes);


module.exports = router;
