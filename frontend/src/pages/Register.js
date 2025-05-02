import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
  } from "@mui/material";
  import { useState } from "react";
  import API from "../utils/api"; // adjust path as needed
  
  export default function Register() {
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  
    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
  
      try {
        const response = await API.post("/users/register", {
          name: form.name,
          email_id: form.email, // Note: backend expects `email_id`
          password: form.password,
        });
  
        setSuccess("Registration successful!");
        setForm({ name: "", email: "", password: "" });
      } catch (err) {
        console.error("Register Error:", err.response);
        setError(err.response?.data?.message || "Registration failed.");
      }
    };
  
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
  
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
  
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  