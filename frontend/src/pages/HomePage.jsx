import React, { useEffect, useState } from 'react';
import api from '../api';

function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/')
      .then((response) => setMessage(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to Freshly Project</h1>
      <p>{message}</p>
    </div>
  );
}

export default HomePage;
