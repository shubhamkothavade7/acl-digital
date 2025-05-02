import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Products', title: 'Products', href: paths.dashboard.products, icon: 'users' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'plugs-connected' },
  { key: 'orders', title: 'Orders List', href: paths.dashboard.orders, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
