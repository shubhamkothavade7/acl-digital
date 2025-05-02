const Cart = require('../models/cart');

// Add product to the cart

class CartController {
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }

      const cart = await Cart.findOne({ user: req.user });

      if (cart) {
        const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productId
        );

        if (productIndex >= 0) {
          cart.products[productIndex].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return res.status(200).json({ message: "Cart updated", data: cart });
      }

      const newCart = new Cart({
        user: req.user,
        products: [{ product: productId, quantity }],
      });
      await newCart.save();

      return res.status(200).json({ message: "Cart created", data: newCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something Went Wrong", data: [] });
    }
  }


  async getCart(req, res) {
    try {
      const cart = await Cart.findOne({ user: req.user }).populate('products.product');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart' });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;  // Get productId from params
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      const cart = await Cart.findOne({ userId: req.user._id });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const productExists = cart.products.some(p => p.product.toString() === productId);
  
      if (!productExists) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      // Remove the product
      cart.products = cart.products.filter(p => p.product.toString() !== productId);
  
      await cart.save();
  
      res.status(200).json({ message: "Product removed successfully", products: cart.products });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

  async updateCart(req,res){
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id; // assuming req.user is populated by authenticate middleware
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
  
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Find product in cart
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
  
      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Update quantity
      cart.products[productIndex].quantity = quantity;
  
      await cart.save();
  
      res.status(200).json({ message: "Cart updated successfully", products: cart.products });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}


module.exports = new CartController();
