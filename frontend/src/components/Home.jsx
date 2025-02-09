import React, { useState, useEffect } from 'react';
import Loader from './layouts/Loader';
import { Typography, Button, Box, Paper } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import { motion } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #27667B 0%, #143D60 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 5,
            borderRadius: 3,
            maxWidth: 600,
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(3, 233, 72, 0.77)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            color: '#fff',
          }}
        >
          <BoltIcon color="warning" sx={{ fontSize: 60 }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            EnerGauge
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }} gutterBottom>
            Track and forecast your energy consumption.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
              Get Started
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Home;
