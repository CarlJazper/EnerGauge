import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
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
  if (role === 'admin') return null;
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
    color: '#6BC72A',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': { color: '#27667B', opacity: 0.7 },
  };

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  // Define nav links based on user role
// Define nav links based on user role
const navLinks =
  role === 'admin'
    ? [
        // Admin-specific links (if any)
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

        // Show "About Us" only if the user is NOT logged in
        ...(!isLoggedIn ? [{ name: 'About Us', path: '/about' }] : []),
      ];


  return (
    <AppBar position="static" sx={{backgroundColor: "transparent", boxShadow:"none"}}>
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
                  borderBottom: isActive(link.path) ? '3px solid #00953B' : 'none',
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
              sx={{ bgcolor:'#00953B', borderRadius:'15px', width:'100px'}}>
                <Typography sx={{ fontWeight:'bold' }}>Login</Typography>
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;