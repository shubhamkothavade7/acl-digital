// src/pages/Orders.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // ADD THIS

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("user");
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      {orders.length === 0 ? (
        <Typography>No orders yet</Typography>
      ) : (
        orders.map(order => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Order ID: {order._id}</Typography>
              <Typography>Status: {order.status}</Typography>
              <Typography>Total: ₹{order.totalAmount}</Typography>
              <Typography>Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
              
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate(`/orders/${order._id}`)} // UPDATED THIS
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
