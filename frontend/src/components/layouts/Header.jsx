import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const navigate = useNavigate();
  const location = useLocation(); // Detects route changes

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole || 'user');
    } else {
      setIsLoggedIn(false);
      setRole('');
    }
  }, [location.pathname]); // Runs effect when the route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
    setAnchorEl(null);
    navigate('/'); // Redirect after logout
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Define nav link styles
  const navLinkStyle = {
    color: '#143D60',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': { color: '#27667B', opacity: 0.7 },
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  // Define nav links based on user role
  const navLinks =
  role === 'admin'
    ? [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Train Energy Model', path: '/admin/train' },
        { name: 'Train Forecast Model', path: '/admin/train_arima' },
      ]
    : [
        ...(isLoggedIn && role === 'user'
          ? [{ name: 'Dashboard', path: '/dashboard' }] // Show "Dashboard" instead of "Home"
          : [{ name: 'Home', path: '/' }]), // Show "Home" for guests

        ...(isLoggedIn && role === 'user'
          ? [
              { name: 'Prediction', path: '/prediction' },
              { name: 'Forecast', path: '/forecast' },
            ]
          : []),

        { name: 'About Us', path: '/about' },
      ];


  return (
    <AppBar position="static" sx={{backgroundColor: "#DDEB9D"}}>
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
              <img src="/images/logo.png" alt="Logo" style={{ height: '4rem', borderRadius:'50%' }} />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', flexGrow: 1, gap: 2}}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  ...navLinkStyle,
                  borderBottom: isActive(link.path) ? '2px solid #143D60' : 'none',
                }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* Profile Dropdown / Login Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{role.charAt(0).toUpperCase()}</Avatar>
                </IconButton>

                {/* Dropdown Menu */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate('/profile');
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login"
              sx={{ bgcolor:'#27667B' }}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;