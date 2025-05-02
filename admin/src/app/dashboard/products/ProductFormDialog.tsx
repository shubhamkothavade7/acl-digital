'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  Paper,
  InputAdornment,
} from '@mui/material';
import { 
  TextT,
  TextAlignLeft, 
  CurrencyDollar,
  Image,
  CloudArrowUp,
  Plus
} from '@phosphor-icons/react';

export interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  image: string; // Image URL or file
}

interface ProductFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData?: ProductFormValues;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<ProductFormValues>({
    title: '',
    description: '',
    price: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
      });
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (field: keyof ProductFormValues, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
      setFormData((prev) => ({
        ...prev,
        image: fileURL,
      }));
    } else {
      setImagePreview(null);
      setFormData((prev) => ({
        ...prev,
        image: '',
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/product/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      // After successful API call
      console.log("the form data of add produt is ",formData);
      onSubmit(formData);  // still call the parent's callback if needed
      onClose();           // close the dialog
    } catch (error) {
      console.error('Error:', error);
      // optionally you can show a toast or alert
    }
  };
  

  // Common TextField styling
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 12px rgba(99, 91, 255, 0.15)',
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
    },
    marginBottom: 1
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        elevation: 8,
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          fontSize: '1.5rem',
          color: 'black',
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        {mode === 'add' ? (
          <>
            <Plus size={24} weight="bold" color="#635BFF" />
            Add New Product
          </>
        ) : (
          <>
            ✏️ Edit Product
          </>
        )}
      </DialogTitle>
      
      <DialogContent dividers sx={{ padding: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Product Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextT size={22} color="#635BFF" weight="duotone" />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />
          
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <TextAlignLeft size={22} color="#635BFF" weight="duotone" />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />
          
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyDollar size={22} color="#635BFF" weight="duotone" />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />

          {/* Image URL or File Upload */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: '#635BFF',
                mb: 2
              }}
            >
              <Image size={22} color="#635BFF" weight="duotone" /> 
              Product Image
            </Typography>
            
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="https://example.com/image.jpg"
              sx={{
                ...textFieldStyle,
                mb: 2
              }}
            />
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={1.5}>
              — OR —
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudArrowUp size={22} color="#635BFF" weight="duotone" />}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 2,
                py: 1.2,
                fontWeight: 500,
                borderWidth: 2,
                borderColor: '#635BFF',
                color: '#635BFF',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#635BFF',
                  backgroundColor: 'rgba(99, 91, 255, 0.04)',
                }
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
              />
            </Button>
            
            {imagePreview && (
              <Box
                mt={2.5}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: '100%',
                  height: '200px',
                  boxShadow: 3,
                  border: '2px solid #635BFF',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    padding: 1
                  },
                }}
              >
                <img src={imagePreview} alt="Preview" />
              </Box>
            )}
          </Paper>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: '20px 24px', 
        display: 'flex', 
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa'
      }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#666', 
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            }
          }}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disableElevation
          sx={{
            backgroundColor: '#635BFF',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            paddingX: 3,
            '&:hover': {
              backgroundColor: '#5549FF',
              boxShadow: '0 6px 10px rgba(99, 91, 255, 0.2)',
            },
          }}
        >
          {mode === 'add' ? 'Add New Product' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};