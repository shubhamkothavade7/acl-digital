// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // light/dark icons
import { isLoggedIn } from '../utils/auth';
import axios from 'axios';

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('user');
      console.log("the token from the handlelogout function", token);

      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('user');

      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Grocery Store
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {loggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/cart">Cart</Button>
            <Button color="inherit" component={Link} to="/orders">Orders</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
        {/* Dark Mode Toggle Button */}
        <IconButton color="inherit" onClick={toggleDarkMode} sx={{ ml: 2 }}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
