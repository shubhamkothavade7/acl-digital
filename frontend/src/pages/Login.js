// src/pages/Login.jsx
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
  } from "@mui/material";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_id: email,
              password: password,
            }),
          });

          const data = await res.json();
  
        if (data.message === 'Login successful') {
          localStorage.setItem("user", data.data);
          navigate("/"); // ✅ redirect to home page (Product listing)
        } else {
          alert("Invalid credentials");
        }
      } catch (err) {
        console.error(err);
        alert("Login failed");
      }
    };
  
    return (
      <Container maxWidth="sm" sx={{ mt: 8 , p: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  