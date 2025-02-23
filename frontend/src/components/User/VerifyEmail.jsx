import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (!token) {
      setStatus('failed');
      setMessage('Invalid verification link.');
      return;
    }
    
    axios.post('http://localhost:5000/api/users/verify_email', { token })
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now log in.');
      })
      .catch((error) => {
        setStatus('failed');
        setMessage(error.response?.data?.message || 'Email verification failed.');
      });
  }, [location.search]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, textAlign: 'center', borderRadius: 4, boxShadow: 3 }}>
        {status === 'verifying' ? (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Verifying your email...</Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" color={status === 'success' ? 'green' : 'error'}>
              {message}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
