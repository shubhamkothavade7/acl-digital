const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Login route
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;
