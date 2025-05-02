import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Divider, 
  Box 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("user")?.replace(/"/g, '');
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.products || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("user")?.replace(/"/g, '');
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong!");
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  return (
    <Container sx={{ paddingTop: '80px', mb: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout Bill
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item</strong></TableCell>
                <TableCell align="right"><strong>Price (₹)</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Subtotal (₹)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product._id}>
                  <TableCell>{item.product.title}</TableCell>
                  <TableCell align="right">{item.product.price}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.product.price * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Total Amount:</Typography>
          <Typography variant="h6" fontWeight="bold">₹{getTotal()}</Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ marginTop: 3 }}
          onClick={handleCheckout}
        >
          Place Order
        </Button>
      </Paper>
    </Container>
  );
}
