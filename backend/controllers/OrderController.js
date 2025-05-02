const Order = require('../models/order');
const Cart = require('../models/cart');

// Create an order from the cart
class OrderController{
    async createOrder(req,res){
        try{
            const cart = await Cart.findOne({ user: req.user }).populate('products.product');

            if (!cart) {
            return res.status(400).json({ message: 'No items in cart' , data:[] });
            }

            // Calculate total amount
            const totalAmount = cart.products.reduce((total, p) => total + p.product.price * p.quantity, 0);

            // Create the order
            const order = new Order({
            user: req.user,
            products: cart.products,
            totalAmount,
            shippingAddress: req?.body?.shippingAddress || 'Mumbai',
            paymentMethod: req?.body?.paymentMethod || 'COD',
            });

            await order.save();

            // Clear the cart after placing the order
            await Cart.findOneAndDelete({ user: req.user });

            res.status(201).json(order);

        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Somthing Went Wrong' });
        }
    }

    async getOrders(req,res){
        try{
            const orders = await Order.find({ user: req.user });
            res.status(200).json(orders);
        }catch(error){
            res.status(500).json({ message: 'Somthing Went Wrong' , data:[]});
        }
    }

    async fetchOrder(req,res){
        try{
            const { orderId } = req.params;
            const order = await Order.findById(orderId).populate('products.product'); // if you want product details too
            if (!order) {
            return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);

        }catch(error){
            console.error('Error fetching order details:', error);
            res.status(500).json({ message: 'Server Error' });
        }

    }

}




module.exports = new OrderController();
