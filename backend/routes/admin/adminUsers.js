const express = require('express');
const UserController = require('../../controllers/UserController');
const rateLimiter = require('../../middleware/rateLimitMiddleware');
const protect = require('../../middleware/authMiddleware');

const router = express.Router();

// Apply rate limiter to the get all products route
router.get('/customers', protect, rateLimiter, UserController.getCustomers );
router.post('/update/:id', protect, rateLimiter, UserController.updateUsers);
router.get('/fetch-orders', protect, rateLimiter, UserController.fetchOrders);
router.get('/dashboard-details', protect, rateLimiter, UserController.dashboardDetails);



module.exports = router;