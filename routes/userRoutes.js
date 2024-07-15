const express = require('express');


const {
  loginController,
  registerController,
  authController,
  googleLoginController,
  googleRegisterController 
} = require("../controllers/userCtrl");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/google-login', googleLoginController);
router.post('/google-register', googleRegisterController); 
router.post('/getUserData', authMiddleware, authController);

module.exports = router;
