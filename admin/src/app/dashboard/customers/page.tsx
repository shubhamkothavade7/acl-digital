"use client";
import * as React from 'react';
import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import CustomerFormDialog from './CustomerFormDialog'; // Import CustomerFormDialog

interface Customer {
  _id: string;
  name: string;
  email_id: string;
  role_id: number;
}

export default function Page(): React.JSX.Element {
  const [customersState, setCustomersState] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false); // New: Manage dialog open/close

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/admin/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomersState(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleMakeAdmin = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/admin/update/${userId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        alert('User promoted to Admin successfully!');
        fetchCustomers(); // refresh after making admin
      }
    } catch (error) {
      console.error('Error promoting user to Admin:', error);
      alert('Failed to promote user.');
    }
  };

  const handleAddCustomer = async (customerData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/admin/add-customer', customerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Customer added successfully!');
        fetchCustomers(); // Refresh the customer list
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer.');
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={() => setOpenDialog(true)} // Open the form
            variant="contained"
          >
            Add
          </Button>
        </div>
      </Stack>

      <Grid container spacing={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersState.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email_id}</TableCell>
                <TableCell>{customer.role_id === 2 ? 'Customer' : 'Admin'}</TableCell>
                <TableCell>
                  {customer.role_id === 2 && (
                    <Button
                      onClick={() => handleMakeAdmin(customer._id)}
                      variant="contained"
                      color="primary"
                    >
                      Make Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>

      {/* Customer Form Dialog */}
      <CustomerFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={(data) => {
          handleAddCustomer(data);
          setOpenDialog(false);
        }}
      />
    </Stack>
  );
}
