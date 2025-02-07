import React from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
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
          </Box>
          
          {/* Login Button on the right */}
          <Button color="inherit" component={Link} to="/login">Login</Button>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
