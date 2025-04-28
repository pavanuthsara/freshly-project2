import axios from 'axios';

const baseURL = 'http://localhost:5000';

// Logout handler
export const logoutDriver = async (navigate) => {
  try {
    console.log('Initiating logout...');
    await axios.post(`${baseURL}/api/drivers/logout`, {}, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    // Clear client-side tokens
    localStorage.removeItem('token');
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=strict';

    console.log('Logout successful, redirecting to /drivers/login');
    navigate('/drivers/login');
  } catch (error) {
    console.error('Logout Error:', error.response?.data || error.message);
    // Clear tokens even if API fails
    localStorage.removeItem('token');
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=strict';
    navigate('/drivers/login');
  }
};