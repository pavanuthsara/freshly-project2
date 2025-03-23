import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Freshly.lk 🍅</h1>
      <p style={styles.subtitle}>
        Order fresh produce directly from local farmers!
      </p>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/buyer/login')}>
          Buyer Login
        </button>
        <button style={styles.button} onClick={() => navigate('/buyer/register')}>
          Buyer Register
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: '32px',
    color: '#2563eb',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#374151',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default HomePage;
