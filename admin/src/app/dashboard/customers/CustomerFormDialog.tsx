"use client";
import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

interface CustomerFormDialogProps {
  open: boolean;
  onClose: () => void;
  fetchCustomers: () => void;
}

export default function CustomerFormDialog({ open, onClose, fetchCustomers }: CustomerFormDialogProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState(2); // 2 = Customer by default

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/users/register', 
        {
          name,
          email_id:email,
          role_id: role
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Customer created:', response.data);
      // fetchCustomers(); // Refresh customer list
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer.');
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRole(2); // reset to default "Customer"
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="email_id"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(Number(e.target.value))}
          >
            <MenuItem value={2}>Customer</MenuItem>
            <MenuItem value={1}>Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
