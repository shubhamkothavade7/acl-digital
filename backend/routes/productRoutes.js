const express = require('express');
const productController = require('../controllers/productController');
const rateLimiter = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Apply rate limiter to the get all products route
router.get('/', rateLimiter, productController.getAllProducts);

module.exports = router;