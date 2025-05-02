const users = require('../models/Users');
const bcrypt = require('bcrypt');
const Validator = require('validatorjs');
const User = require('../models/Users');
const Order = require('../models/order');
const Product = require('../models/productModel');
class UserController{
    async createUser(req, res) {
        try {
            const data = req.body;
            console.log("the useData is ",req.userData);
            // if(req.userData.role_id == 1){
            //     console.log("enter into the if condition");
            //     const { name, email_id ,role_id } = data;
            //     console.log(data);
            //     const isUserExist = await users.findOne({email_id:email_id});
            //     if(isUserExist){
            //         return res.status(400).json({message: "Email Is Already Exist" ,data: []});
            //     }
            //     const userInfo = new users({
            //         name,
            //         email_id,
            //         password:process.env.PASSWORD,
            //         role_id:role_id //2 means customers role
            //     });
            //     const result = await userInfo.save();
    
            //     return res.status(200).json({ message: "Success", data: result });

            // }
            console.log("enter out of the if condition");
            const rules = {
                name: 'required',
                email_id: 'required',
                password: 'required',
            };
            const validation = new Validator(data, rules);
    
            if (validation.fails()) {
                const firstError = validation.errors.first(Object.keys(validation.errors.all())[0]);
                return res.status(400).json({message: firstError,data: []});
            }
            console.log(data);
            const { name, email_id, password,role_id } = data;
            const isUserExist = await users.findOne({email_id:email_id});
            if(isUserExist){
                return res.status(400).json({message: "Email Is Already Exist" ,data: []});
            }
    
            const userInfo = new users({
                name,
                email_id,
                password,
                role_id:role_id || 2 //2 means customers role
            });
    
            const result = await userInfo.save();
    
            return res.status(200).json({ message: "Success", data: result });
    
        } catch (error) {
            console.error("Create User Error:", error.message);
            return res.status(500).json({ message: "Something Went Wrong", data: [] });
        }
    }

    async getCustomers(req, res) {
        try {
            const userData = req.userData;
            if(userData.role_id != 1){
                return res.status(400).json({message: "Not A Admin",data: []});
            }
            const result = await User.find({role_id:2});
            return res.status(200).json({ message: "Success", data: result });
    
        } catch (error) {
            console.error("Create User Error:", error.message);
            return res.status(500).json({ message: "Internal server error", data: [] });
        }
    }

    async updateUsers(req,res){
        try{
            const userData = req.userData;
            if(userData.role_id != 1){
                return res.status(400).json({message: "Not A Admin",data: []});
            }
            const { id } = req.params;

            // Find the user first
            const user = await User.findById(id);

            if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Update role_id to 1 (admin)
            user.role_id = 1;
            await user.save();

            return res.status(200).json({ success: true, message: 'User updated to admin successfully', user });

        }catch (error) {
            console.error("Create User Error:", error.message);
            return res.status(500).json({ message: "Something Went Wrong", data: [] });
        }
    }

    async fetchOrders(req,res){
        try{
            console.log("eecuting the fetchOrdes");
            if(req.userData.role_id != 1){
                return res.status(400).json({ message: "Only Admin Can Access", data: [] });
            }
            const result = await Order.find({});
            if(result.length <= 0){
                return res.status(400).json({ message: "Orders Not Found", data: [] });
            }
            return res.status(200).json({ message: "Success", data: result });

        }catch(error){
            console.error("Create User Error:", error.message);
            return res.status(500).json({ message: "Something Went Wrong", data: [] });
        }
    }

    async dashboardDetails(req,res){
        try{
            console.log("eecuting the fetchOrdes");
            if(req.userData.role_id != 1){
                return res.status(400).json({ message: "Only Admin Can Access", data: [] });
            }
            const ordersCount = await Order.find({});
            const productCount = await Product.find({});
            const customerCount = await User.find({role_id:2});
            const totalProfit = ordersCount.reduce((acc, order) => acc + order.totalAmount, 0);


            const json = {
                orders : ordersCount.length || 0,
                products : productCount.length || 0,
                customers : customerCount.length || 0,
                profit :  totalProfit || 0
            };

            
            return res.status(200).json({ message: "Success", data: json });

        }catch(error){
            console.error("Create User Error:", error.message);
            return res.status(500).json({ message: "Something Went Wrong", data: [] });
        }

    }
}

module.exports = new UserController();