import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuyerSidebar from './BuyerSidebar';

const BuyerProfile = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/buyers/profile', {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to load profile';
        setErrorMsg(msg);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <BuyerSidebar />
      
      <div style={{ marginLeft: '220px', padding: '30px', flex: 1 }}>
        <h2>Buyer Profile</h2>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {user ? (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          !errorMsg && <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default BuyerProfile;
