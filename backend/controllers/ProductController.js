const Product = require('../models/productModel');
const Validator = require('validatorjs');

class ProductController {
    async createProduct(req, res) {
        try {
            console.log("User data:", req.userData);
    
            const role_id = req.userData.role_id;
            if (role_id !== 1) {
                return res.status(400).json({ message: "Only Admin Can Access This API", data: [] });
            }
    
            const data = req.body;
            console.log("Incoming form data:", data);
    
            const { image, title, price, description } = data;
    
            // Validate input
            let rules = {
                title: 'required',
                image: 'required',
                price: 'required',
                description: 'required|max:18'
            };
    
            let validation = new Validator(data, rules);
    
            if (validation.fails()) {
                return res.status(400).json({ message: validation.errors.all(), data: [] });
            }
    
            console.log("Validated form data:", data);
    
            // Create new product
            const product = new Product({
                image,
                title,
                price,
                description
            });
    
            const result = await product.save();
    
            console.log("Product saved successfully:", result);
    
            return res.status(200).json({ message: 'Success', data: result });
    
        } catch (err) {
            console.error("Error in createProduct:", err);
            return res.status(500).json({ message: "Something Went Wrong", data: [] });
        }
    }
    

    async getAllProducts(req,res) {
        try {
            const products = await Product.find();
            if(products.length <= 0){
                return res.status(400).json({message:"No Product Found" , data:[]});
            }
            return res.status(200).json({message:"Success" , data:products});
        } catch (err) {
            return res.status(500).json({message:"Something Went Wrong" , data:[]});
        }
    }

    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Not found' });
            res.json(product);
        } catch (err) {
            return res.status(500).json({message:"Something Went Wrong" , data:[]});
        }
    }

    async deleteProduct(req, res) {
        try {
            const role_id = req.userData.role_id;
            if(role_id !== 1){
                res.status(400).json({message:"Only Admin Can Access This Api" , data:[]});
            }
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"Product deleted" , data:[]});
        } catch (err) {
            return res.status(500).json({message:"Something Went Wrong" , data:[]});
        }
    }

    async updateProduct(req, res) {
        try {
            const role_id = req.userData.role_id;
            if(role_id !== 1){
                res.status(400).json({message:"Only Admin Can Access This Api" , data:[]});
            }
            console.log("the mongo id is ",req.params.id);
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            console.log(product);
            return res.status(200).json({message:"Product Updated" , data:product});
        } catch (err) {
            return res.status(500).json({message:"Something Went Wrong" , data:[]});
        }
    }
}

module.exports = new ProductController(); // Export the object of the class
