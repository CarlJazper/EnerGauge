import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Detects route changes

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole || 'user');
    } else {
      setIsLoggedIn(false);
      setRole('');
    }
  }, [location.pathname]); // Runs effect when the route changes

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    navigate('/'); // Redirect after logout
  };

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
              <img src="/images/logo.png" alt="Logo" style={{ height: '40px' }} />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 2 }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About Us</Button>

            {isLoggedIn && role === 'user' && <Button color="inherit" component={Link} to="/prediction">Prediction</Button>}
            {isLoggedIn && role === 'admin' && <Button color="inherit" component={Link} to="admin/train">Train Model</Button>}
          </Box>

          {/* Login / Profile Management */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/profile">Profile Management</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
