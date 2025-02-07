import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Check if token is available in sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      // Decode the token to get the role
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get role
      setRole(decodedToken.role || 'user');  // Set the role, default to 'user'
      setIsLoggedIn(true);  // Set logged-in state
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
  };

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo on the left */}
          <Box sx={{ flexGrow: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
              <img
                src="/images/logo.png" // Path to your logo in the public/images folder
                alt="EnerGauge Logo"
                style={{ height: '40px' }} // Adjust logo size
              />
            </IconButton>
          </Box>
          
          {/* Navigation Links in the center */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 2 }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About Us</Button>
            
            {/* Show Prediction link only for users */}
            {isLoggedIn && role === 'user' && (
              <Button color="inherit" component={Link} to="/prediction">Prediction</Button>
            )}
          </Box>
          
          {/* Login / Profile Management Button on the right */}
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
