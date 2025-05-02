import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
    // eslint-disable-next-line
  }, []);

  const fetchCartData = async () => {
    const token = localStorage.getItem("user");

    if (!token) {
      console.error("User is not logged in.");
      navigate("/login");
      return;
    }

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

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem("user");

    if (!token) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.products || []);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem("user");

    if (!token) {
      console.error("User is not logged in.");
      return;
    }

    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/cart/update/${productId}`, 
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state also
      setCartItems(items =>
        items.map(item =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  return (
    <Container sx={{ marginTop: '80px', mb: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No items in your cart
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {cartItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.product._id}>
              <Card
                sx={{
                  maxWidth: 250,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 3,
                  borderRadius: 2,
                  p: 1,
                  height: '100%',
                }}
              >
                <CardMedia
                  component="img"
                  image={item.product.image}
                  alt={item.product.title}
                  sx={{
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap>
                    {item.product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Price: ₹{item.product.price}
                  </Typography>

                  {/* Quantity Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <IconButton
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {cartItems.length > 0 && (
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total: ₹{getTotal().toFixed(2)}
          </Typography>
          <Button variant="contained" color="primary" href="/checkout">
            Checkout
          </Button>
        </Box>
      )}
    </Container>
  );
}
