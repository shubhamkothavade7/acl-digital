import * as React from 'react';
import { Box, Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import dayjs from 'dayjs';

export function ProductsGrid(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    price: 0,
    description: '',
    image: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // const fetchProducts = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/products');
    //     setProducts(response.data.data);
    //     setLoading(false);
    //   } catch (err: any) {
    //     console.error('Failed to fetch products:', err);
    //     setError('Failed to load products');
    //     setLoading(false);
    //   }
    // };

    fetchProducts();
  }, []);

  const handleEditProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedProduct(product);
      console.log("the product is sssss",product);
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image
      });
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
      const updatedData = { ...formData };
      console.log("the token is ",token);
      console.log("the selectedProduct is ",selectedProduct);
      const response = await axios.put(`http://localhost:5000/api/admin/product/update/${selectedProduct._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Product updated:', response.data.data);

      // Update the local products state after successful update
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === selectedProduct.id ? response.data.data : product
        )
      );
      fetchProducts();
      setProducts(null);
      handleCloseModal();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      console.log("the token from the delete is ",token);
      console.log("the product_id is ",productId);
      await axios.delete(`http://localhost:5000/api/admin/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Product deleted:', productId);

      // Remove the deleted product from local state
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlndpwDalSNF8TzBG6T7kGv73l0IOReNJpKw&s';
                    }}
                  />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.description}
                  </Typography>
                </TableCell>
                <TableCell>{dayjs(product.createdAt).format('MMM D, YYYY')}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditProduct(product._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Product Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-product-modal"
        aria-describedby="edit-product-form"
      >
        <Box sx={{ width: 400, padding: 2, margin: 'auto', backgroundColor: 'white', marginTop: '10%', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Edit Product</Typography>
          <TextField
            label="Name"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmitEdit}>Update</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
