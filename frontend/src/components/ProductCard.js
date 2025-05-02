import { Avatar, Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // optional, for button icon
import dayjs from 'dayjs'; // only if you have dates you want to show

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              src={product.image} 
              variant="square" 
              sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }} 
            />
          </Box>
          <Stack spacing={1}>
            <Typography align="center" variant="h6" noWrap>
              {product.title}
            </Typography>
            <Typography align="center" variant="body2" color="text.secondary">
              {product.description.length > 80 
                ? `${product.description.substring(0, 80)}...`
                : product.description}
            </Typography>
            <Typography align="center" variant="h6" color="primary" sx={{ mt: 1 }}>
              ₹{product.price}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />

      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<ShoppingCartIcon />}
          >
            Add to Cart
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default ProductCard;
