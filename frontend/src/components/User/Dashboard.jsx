import React, { useState, useEffect } from 'react';
import Loader from '../layouts/Loader';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchUserForecasts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user/forecasts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForecastData(response.data);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };
    fetchUserForecasts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Welcome Message */}
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">User Dashboard</Typography>
      </Grid>

      {/* Forecast Data Visualization */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6">Forecast Data</Typography>
            {forecastData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="predicted_consumption" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography>No forecast data available.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Make New Prediction */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Make a New Prediction</Typography>
            <Typography variant="body2">Use the prediction section to forecast energy consumption.</Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} href="/predict">
              Go to Prediction
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserDashboard;
