import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, ThemeProvider, createTheme, Paper, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Create a custom theme with a green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#7cb342', // Soft green
      light: '#aed581', // Light pastel green
      dark: '#558b2f', // Darker green for contrast
    },
    background: {
      default: '#f1f8e9', // Very light pastel green background
    },
    text: {
      primary: '#33691e', // Dark green for text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20, // Curved textboxes
            backgroundColor: '#ffffff',
            '&:hover fieldset': {
              borderColor: '#7cb342',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7cb342',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Curved button
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(124, 179, 66, 0.3)',
            backgroundColor: '#8bc34a', // Slightly lighter green on hover
          },
        },
      },
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      const role = decodedToken.role || 'user';
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'user') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
        <Paper elevation={0} sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(124, 179, 66, 0.1)',
          backgroundColor: '#ffffff',
        }}>
          <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'primary.dark' }}>
            Login
          </Typography>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', backgroundColor: 'primary.main' }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {message && (
            <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
              {message}
            </Typography>
          )}
          
          <Typography variant="body2" sx={{ mt: 2, color: 'text.primary' }}>
            Don't have an account?{' '}
            <Link href="/register" sx={{ color: 'primary.dark', fontWeight: 'medium' }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
