const express = require('express');
const {
    loginController,
    registerController,
    authController,
    googleLoginController // Ajoutez ce contrôleur
} = require ("../controllers/userCtrl");
const authMiddleware = require('../middleware/authMiddleware');

// router onject 
const router = express.Router();

// routes 

//login || POST 
router.post('/login', loginController);

// register || POST 
router.post('/register', registerController);

// Google Login || POST
router.post('/google-login', googleLoginController); // Ajoutez cette ligne

//Auth || POST 
router.post('/getUserData', authMiddleware,authController);

module.exports = router;
