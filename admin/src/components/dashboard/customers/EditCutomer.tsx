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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { Customer } from './CustomerTable';

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialData?: Customer | null;
}

export function CustomerDialog({
  open,
  onClose,
  onSave,
  initialData,
}: CustomerDialogProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<Customer>(
    initialData || {
      id: '',
      name: '',
      email: '',
      avatar: '',
      purchases: 0,
      lastSeen: new Date(),
      role: 'Customer',
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        avatar: '',
        purchases: 0,
        lastSeen: new Date(),
        role: 'Customer',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      lastSeen: new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
            fullWidth
          />
          <TextField
            name="avatar"
            label="Avatar URL"
            value={formData.avatar}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="purchases"
            label="Purchases"
            type="number"
            value={formData.purchases}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="Customer">Customer</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
