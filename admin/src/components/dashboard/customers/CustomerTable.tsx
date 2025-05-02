'use client'
import * as React from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DotsThreeVertical } from '@phosphor-icons/react/dist/ssr';

export interface Customer {
    id: string;
    name: string;
    email: string;
    avatar: string;
    purchases: number;
    lastSeen: Date;
    role: 'Admin' | 'Customer';
  }
  

interface CustomerTableProps {
  customers: Customer[];
  onEditRole: (id: string) => void;
  onEditInfo: (id: string) => void;
}

export function CustomerTable({
  customers,
  onEditRole,
  onEditInfo,
}: CustomerTableProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customerId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomerId(customerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId(null);
  };

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
        <TableRow>
  <TableCell>Customer</TableCell>
  <TableCell>Email</TableCell>
  <TableCell>Role</TableCell>
  <TableCell>Purchases</TableCell>
  <TableCell>Last Active</TableCell>
  <TableCell align="right">Actions</TableCell>
</TableRow>

        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={customer.avatar} alt={customer.name} />
                  <Typography variant="subtitle2">{customer.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.purchases}</TableCell>
              <TableCell>{customer.lastSeen.toLocaleString()}</TableCell>
              <TableCell>{customer.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuOpen(e, customer.id)}>
                  <DotsThreeVertical size={20} weight="bold" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
      
        <MenuItem
          onClick={() => {
            if (selectedCustomerId) onEditInfo(selectedCustomerId);
            handleMenuClose();
          }}
        >
          Edit Info
        </MenuItem>
      </Menu>
    </TableContainer>
  );
  
}
