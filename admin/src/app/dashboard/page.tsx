'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [dashboardData, setDashboardData] = React.useState<any>(null); // <-- Added
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const productsRes = await fetch('http://localhost:5000/api/products');
        const ordersRes = await fetch('http://localhost:5000/api/auth/admin/fetch-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const dashboardDetailsRes = await fetch('http://localhost:5000/api/auth/admin/dashboard-details', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const dashboardDataRes = await dashboardDetailsRes.json();

        console.log("the product data is ", productsData);
        console.log("the orders data is ", ordersData);
        console.log("the dashboard Details  is ", dashboardDataRes);

        if (productsRes.ok && ordersRes.ok && dashboardDetailsRes.ok) {
          setProducts(productsData.data);
          setOrders(ordersData.data);
          setDashboardData(dashboardDataRes); // <-- set dashboardData here
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err.message);
        setError(err.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total profit
  const totalProfit = orders.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);

  if (loading || !dashboardData) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={dashboardData.data.orders} /> {/* TOTAL ORDERS */}
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={dashboardData.data.customers} /> {/* TOTAL CUSTOMERS */}
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={dashboardData.data.products} /> {/* TOTAL PRODUCTS */}
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value={`${totalProfit}`} /> {/* TOTAL ORDER AMOUNT */}
      </Grid>

      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>

      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>

      <Grid lg={4} md={6} xs={12}>
        <LatestProducts products={products} sx={{ height: '100%' }} />
      </Grid>

      <Grid lg={8} md={12} xs={12}>
        <LatestOrders orders={orders} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
