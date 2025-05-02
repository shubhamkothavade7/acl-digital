import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>🎉 Order Placed!</Typography>
      <Typography>Your order has been placed successfully. Thank you!</Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 3 }}>
        Back to Home
      </Button>
    </Container>
  );
}
