import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'leaflet/dist/leaflet.css';

// Contexts
import { AuthProvider, AuthContext } from './handlers/AuthContext';
import { CartProvider, CartContext } from './handlers/CartContext';

// Routes
import { routes } from './handlers/routes';

// Layout Wrapper
import LayoutWrapper from './handlers/LayoutWrapper';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AuthContext.Consumer>
          {({
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            farmerData,
            handleLoginSuccess,
            handleLogout,
            handleRegistrationSuccess,
            loading,
          }) => (
            <CartContext.Consumer>
              {({
                cartItems,
                setCartItems,
                shippingAddress,
                setShippingAddress,
                paymentMethod,
                setPaymentMethod,
              }) => {
                if (loading) {
                  return <div className="flex h-screen items-center justify-center">Loading...</div>;
                }

                return (
                  <Router>
                    <LayoutWrapper user={user} setUser={setUser} cartItems={cartItems}>
                      <Routes>
                        {routes(
                          isAuthenticated,
                          user,
                          setIsAuthenticated,
                          setUser,
                          cartItems,
                          setCartItems,
                          shippingAddress,
                          setShippingAddress,
                          paymentMethod,
                          setPaymentMethod,
                          farmerData,
                          handleLoginSuccess,
                          handleLogout,
                          handleRegistrationSuccess
                        ).map((route, index) => (
                          <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                          >
                            {route.children &&
                              route.children.map((childRoute, childIndex) => (
                                <Route
                                  key={childIndex}
                                  path={childRoute.path}
                                  element={childRoute.element}
                                />
                              ))}
                          </Route>
                        ))}
                      </Routes>
                    </LayoutWrapper>
                  </Router>
                );
              }}
            </CartContext.Consumer>
          )}
        </AuthContext.Consumer>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;