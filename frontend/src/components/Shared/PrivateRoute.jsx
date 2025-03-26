import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { farmer, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return farmer ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;