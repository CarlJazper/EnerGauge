import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid, Paper } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const UserForecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get("http://localhost:5000/userforecast", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setForecastData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No forecast availale yet.");
        } else {
          setError("Failed to fetch forecast data.");
        }
      } finally {
        setLoading(false);
      }
    };    
    fetchForecast();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  if (error) return <Typography color="error">{error}</Typography>;

  // Check if no forecast data is available
  if (!forecastData || Object.keys(forecastData).length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>No forecast yet</Typography>
      </Box>
    );
  }

  const { total_forecasts, total_energy, total_savings, avg_peak_load, min_peak_load, max_peak_load, avg_factors, energy_by_weekday } = forecastData;

  // Convert weekday data for Line Chart
  const energyTrendData = Object.keys(energy_by_weekday).map(day => ({
    name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
    energy: energy_by_weekday[day]
  }));

  // Convert factor contributions for Pie Chart
  const factorData = Object.keys(avg_factors).map(key => ({
    name: key, value: avg_factors[key]
  }));

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#ffbb28"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>User Forecast Data</Typography>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Forecasts</Typography>
            <Typography variant="h4">{total_forecasts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Energy Usage</Typography>
            <Typography variant="h4">{total_energy} kWh</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Savings</Typography>
            <Typography variant="h4">{total_savings} kWh</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Peak Load Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Avg Peak Load</Typography>
            <Typography variant="h4">{avg_peak_load} kW</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Min Peak Load</Typography>
            <Typography variant="h4">{min_peak_load} kW</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Max Peak Load</Typography>
            <Typography variant="h4">{max_peak_load} kW</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Line Chart: Energy Consumption by Weekday */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Energy Consumption by Day</Typography>
            <LineChart width={400} height={250} data={energyTrendData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>

        {/* Bar Chart: Energy Savings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Energy Savings</Typography>
            <BarChart width={400} height={250} data={[{ name: "Savings", value: total_savings }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Pie Chart: Factor Contributions */}
      <Grid container justifyContent="center" sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Factor Contributions</Typography>
            <PieChart width={400} height={300}>
              <Pie data={factorData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {factorData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForecast;
