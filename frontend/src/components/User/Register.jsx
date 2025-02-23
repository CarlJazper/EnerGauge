import React from 'react';
import { TextField, Button, Box, Typography, Link, ThemeProvider, createTheme, Paper, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';

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

// Yup validation schema
const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });

        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        setErrors({ api: error.response?.data?.message || 'Something went wrong' });
      }
      setSubmitting(false);
    },
  });

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

          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="First Name"
              fullWidth
              {...formik.getFieldProps('firstName')}
              margin="normal"
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
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
              {...formik.getFieldProps('lastName')}
              margin="normal"
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
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
              {...formik.getFieldProps('email')}
              margin="normal"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Phone"
              fullWidth
              {...formik.getFieldProps('phone')}
              margin="normal"
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...formik.getFieldProps('password')}
              margin="normal"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {formik.errors.api && (
              <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2 }}>
                {formik.errors.api}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', backgroundColor: 'primary.main', color: '#fff' }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>

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
