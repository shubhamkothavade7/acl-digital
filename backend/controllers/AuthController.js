const TokenBlacklist = require("../models/TokenBlacklist");
const User = require("../models/Users");
const jwt = require('jsonwebtoken');

class AuthRoutes{

    async login(req,res){
        const { email_id, password } = req.body;
        console.log(email_id);
        console.log(password);
        // Validate email and password
        if (!email_id || !password) {
          return res.status(400).json({ message: 'Please provide email and password' });
        }
        try{
            const user = await User.findOne({ email_id });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Match the password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Generate JWT token
            const token = jwt.sign({ id: user._id , role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', data: token });

        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Something Went Wrong', data:[] });
        }
    }

    async logout(req,res){
        try {
            const authHeader = req.headers.authorization;
            console.log("the token from the back end is ",req.headers.authorization);
            if (!authHeader) {
              return res.status(400).json({ message: "No token provided" });
            }
            let token = authHeader.split(' ')[1];
            console.log(token);
            token = token.replace(/"/g, '');
            console.log(token);
            if (!token) {
              return res.status(400).json({ message: "Invalid token format" });
            }
            jwt.verify(token, process.env.JWT_SECRET,{ ignoreExpiration: true });
            await TokenBlacklist.create({ token });
        
            res.status(200).json({ message: "Logged out successfully" });
          } catch (error) {
            console.error("Logout Error:", error);
            res.status(500).json({ message: "Internal server error" });
          }
    }

}

module.exports = new AuthRoutes();