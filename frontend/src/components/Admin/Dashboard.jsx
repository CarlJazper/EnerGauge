import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ✅ Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [trainingStatus, setTrainingStatus] = useState('Last trained: 2 days ago');

  // Mock data for energy consumption trends
  const energyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: [120, 150, 180, 160, 170, 190],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.3, // Smooth the line
      },
    ],
  };

  const handleTrainModel = () => {
    setTrainingStatus('Training in progress...');
    setTimeout(() => setTrainingStatus('Last trained: Just now'), 3000); // Mock update
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3}>
        {/* Model Training Status */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Model Training Status</Typography>
              <Typography variant="body1">{trainingStatus}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleTrainModel}>
                Train Model
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Uploaded CSV Count */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">CSV Files Processed</Typography>
              <Typography variant="h4">15</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast Accuracy */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Forecast Accuracy</Typography>
              <Typography variant="h4">92%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Energy Consumption Graph */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Energy Consumption Trends</Typography>
              <Line data={energyData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
