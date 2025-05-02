const express = require('express');
const productController = require('../../controllers/ProductController');
const rateLimiter = require('../../middleware/rateLimitMiddleware');
const protect = require('../../middleware/authMiddleware');


const router = express.Router();

// Apply rate limiter to the get all products route
router.post('/create', protect,rateLimiter, productController.createProduct);
router.put('/update/:id', protect,rateLimiter, productController.updateProduct);
router.delete('/delete/:id', protect,rateLimiter, productController.deleteProduct);



module.exports = router;