'use client';

import Orders from '@/components/dashboard/orders/orders';  // component import
import paths from '@/config/paths';                         // paths import

export const metadata = {
  title: 'Orders | Dashboard',  // optional SEO title
  description: 'Manage your orders from here',
};

export default function OrdersPage() {
  return <Orders />;
}
