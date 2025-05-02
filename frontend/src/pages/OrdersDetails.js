// src/pages/OrderDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, Divider, CircularProgress, Box, Alert } from "@mui/material";
import axios from "axios";

export default function OrderDetails() {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("user");
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6">No order details found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Order Summary
      </Typography>

      <Card sx={{ mb: 3, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="subtitle1"><b>Order ID:</b> {order._id}</Typography>
          <Typography variant="subtitle1"><b>Status:</b> {order.status}</Typography>
          <Typography variant="subtitle1"><b>Order Date:</b> {new Date(order.createdAt).toLocaleString()}</Typography>
          <Typography variant="subtitle1"><b>Total Amount:</b> ₹{order.totalAmount}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>Items Purchased:</Typography>

      {order.products.map((item, index) => (
        <Card key={index} sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="subtitle1"><b>Product:</b> {item.product.title}</Typography>
            <Typography variant="subtitle1"><b>Price:</b> ₹{item.product.price}</Typography>
            <Typography variant="subtitle1"><b>Quantity:</b> {item.quantity}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Subtotal: ₹{item.product.price * item.quantity}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
