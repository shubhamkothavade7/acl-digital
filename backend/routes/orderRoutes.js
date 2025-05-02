const express = require('express');
const { createOrder, getOrders, fetchOrder } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:orderId', protect, fetchOrder);

module.exports = router;
