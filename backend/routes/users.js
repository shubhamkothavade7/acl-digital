const express = require('express');
const UserController = require('../controllers/UserController');
const rateLimiter = require('../middleware/rateLimitMiddleware');
// const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Apply rate limiter to the get all products route
router.post('/register', rateLimiter, UserController.createUser );



module.exports = router;