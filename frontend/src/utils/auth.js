// utils/auth.js (optional helper)
export const isLoggedIn = () => {
    return !!localStorage.getItem('user'); // or 'token'
  };
  