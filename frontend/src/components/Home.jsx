import React, { useState, useEffect } from 'react';
import Loader from './layouts/Loader';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Simulate a page refresh by using setTimeout
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // After 2 seconds, stop showing the loader
    }, 1000); // Simulate a 2-second loading delay
  }, []);

  if (loading) {
    return <Loader />; // Show the loader while simulating the page is refreshing
  }

  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4">Welcome to EnerGauge</Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
