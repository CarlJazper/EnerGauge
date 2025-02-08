import React from 'react';
import { Container, Typography, Grid2, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
      
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">150</Typography>
            </CardContent>
          </Card>
        </Grid2>
        
        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">75</Typography>
            </CardContent>
          </Card>
        </Grid2>
        
        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Reports</Typography>
              <Typography variant="h4">20</Typography>
            </CardContent>
          </Card>
        </Grid2>
        
        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h4">$10,000</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Dashboard;
