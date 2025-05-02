'use client';

import React from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Product {
  product: string; // Product ID or Name
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  user: string;
  products: Product[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

const sampleOrders: Order[] = [
  {
    _id: '680b825f8bcec06b5b0a22f7',
    user: '680a40283af3ba103eefd3ea',
    products: [
      {
        product: '680b3ed4ed857023551e4c15',
        quantity: 4,
        _id: '680b63c66e53627fed5c2a77',
      },
      {
        product: '680b3ee1f914a6d937a86b6a',
        quantity: 1,
        _id: '680b66b3b4573da463fec7dd',
      },
    ],
    totalAmount: 15000,
    status: 'Completed',
    shippingAddress: 'Mumbai',
    paymentMethod: 'COD',
    createdAt: '2025-04-25T12:38:55.541Z',
  },
];

const OrdersPage: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Order Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sampleOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {order.products.map((p) => (
                    <div key={p._id}>
                      Product ID: {p.product} (Qty: {p.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrdersPage;
