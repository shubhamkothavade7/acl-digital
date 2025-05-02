export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    products: '/dashboard/products',
    customers: '/dashboard/customers',
    settings: '/dashboard/settings',
    orders:'/dashboard/orders'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
