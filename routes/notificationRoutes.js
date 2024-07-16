const express = require('express');
const { getUserNotificationsController  } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/userNotifications', authMiddleware, getUserNotificationsController);

module.exports = router;
