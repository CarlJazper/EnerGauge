import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, ThemeProvider, createTheme, Paper, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#7cb342', // Soft green
      light: '#aed581', // Light pastel green
      dark: '#558b2f', // Darker green
    },
    background: {
      default: '#f1f8e9',
    },
    text: {
      primary: '#33691e',
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
            borderRadius: 20,
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
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(124, 179, 66, 0.3)',
            backgroundColor: '#8bc34a',
          },
        },
      },
    },
  },
});

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      setSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
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
            Register
          </Typography>

          {success ? (
            <Typography variant="body1" color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
              {message} <br /> Please check your email for verification.
            </Typography>
          ) : (
            <>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
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
                onClick={handleRegister}
                sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', backgroundColor: 'primary.main', color:'#fff'}}
              >
                Register
              </Button>
            </>
          )}

          {message && !success && (
            <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
              {message}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2, color: 'text.primary' }}>
            Already have an account?{' '}
            <Link href="/login" sx={{ color: 'primary.dark', fontWeight: 'medium' }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
