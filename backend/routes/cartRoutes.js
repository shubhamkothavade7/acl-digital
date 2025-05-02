const express = require('express');
const { addToCart, getCart, removeFromCart , updateCart } = require('../controllers/CartController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.put('/update/:productId', protect, updateCart);

module.exports = router;