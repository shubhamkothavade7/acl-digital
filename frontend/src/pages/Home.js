import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetching products from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => console.error("Product fetch error:", err));
  }, []);

  // Handle adding product to the cart
  const handleAddToCart = async (productId, quantity = 1) => {
    let token = localStorage.getItem("user");
    
    if (!token) {
      console.error("User is not logged in.");
      navigate("/login");
      return;
    }
    token = token.replace(/"/g, '');
    try {
      // Make API call to add product to the cart
      const response = await axios.post(
        "http://localhost:5000/api/cart/add", // Update with your actual API endpoint
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product added to cart:", response.data);

      // Optionally, redirect to the cart page or update state if needed
      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <Container sx={{ paddingTop: '80px' }}>
      <Typography variant="h4" gutterBottom>
        Grocery Products
      </Typography>
      <Grid item xs={12} sm={6} md={4} container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ borderRadius: 4 }}>
              <CardMedia
                component="img"
                height="180"
                image={product.image}
                alt={product.title}
              />
              <CardContent>
                <Typography variant="h6">{product.title}</Typography>
                <Typography>{product.description}</Typography>
                <Typography fontWeight="bold">₹{product.price}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
  
}
