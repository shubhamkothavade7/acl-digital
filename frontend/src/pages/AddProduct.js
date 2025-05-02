// // src/pages/AddProduct.jsx
// import React, { useState } from 'react';
// import { Box, TextField, Button, Container, Typography } from '@mui/material';
// import axios from 'axios';

// const AddProduct = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     image: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Replace this URL with your actual backend API
//       const res = await axios.post('http://localhost:5000/api/products', formData);
//       alert('Product added successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Error adding product');
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>Add New Product</Typography>
//       <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//         <TextField
//           label="Title"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />
//         <TextField
//           label="Description"
//           name="description"
//           multiline
//           rows={3}
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <TextField
//           label="Price"
//           name="price"
//           type="number"
//           value={formData.price}
//           onChange={handleChange}
//           required
//         />
//         <TextField
//           label="Image URL"
//           name="image"
//           value={formData.image}
//           onChange={handleChange}
//           required
//         />
//         <Button type="submit" variant="contained" color="primary">Add Product</Button>
//       </Box>
//     </Container>
//   );
// };

// export default AddProduct;
