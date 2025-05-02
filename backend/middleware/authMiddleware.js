const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Protect routes
const protect = (req, res, next) => {
  let token = req?.headers?.authorization;
  console.log("enter in the auth middleware");
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Check if token is in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      console.log(token);
      token = req.headers.authorization.split(' ')[1];
      token = token.replace(/"/g, '');
      // Verify the token
      console.log("the token is ",token);
      if(token == null){
        res.status(400).json({ message: 'Token Is Required', data:[]});
      }
      console.log("going to verify the token");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("the decoded information is ",decoded);

      // Attach user to request
      req.user = decoded.id;
      req.userData = {
        user_id:decoded?.id,
        role_id:decoded?.role_id || undefined
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Not authorized, token failed', data:[] });
    }
  }
  // If no toke
  
};

module.exports = protect;
