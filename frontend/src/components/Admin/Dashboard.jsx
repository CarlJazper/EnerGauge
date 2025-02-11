import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Loader from "../layouts/Loader";
import axios from "axios";

const Dashboard = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [averagePeakLoad, setAveragePeakLoad] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/trends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data);

        // Compute summary statistics
        setTotalPredictions(response.data.length);
        setTotalEnergy(response.data.reduce((sum, f) => sum + (f.forecast_energy?.reduce((a, b) => a + b, 0) || 0), 0));
        setAveragePeakLoad(
          response.data.length > 0
            ? response.data.reduce((sum, f) => sum + (f.peak_load || 0), 0) / response.data.length
            : 0
        );
      })
      .catch((error) => console.error("Error fetching forecast data", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Format data for charts
  const chartData = forecasts.map((f, index) => ({
    date: f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "Unknown",
    energy: f.forecast_energy?.reduce((a, b) => a + b, 0) || 0,
    peakLoad: f.peak_load || 0,
  }));

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Summary Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Forecast Prediction</Typography>
              <Typography variant="h4">{totalPredictions}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Energy Forecasted</Typography>
              <Typography variant="h4">{totalEnergy.toFixed(2)} kWh</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Peak Load</Typography>
              <Typography variant="h4">{averagePeakLoad.toFixed(2)} kW</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Forecasts */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Recent Forecasts
      </Typography>
      <Grid container spacing={2}>
        {forecasts.length > 0 ? (
          forecasts.map((f, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    <strong>Date:</strong> {f.timestamp ? new Date(f.timestamp).toLocaleString() : "Unknown Date"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Energy Consumption:</strong> {f.forecast_energy?.reduce((a, b) => a + b, 0).toFixed(2) || "No Data"} kWh
                  </Typography>
                  <Typography variant="body1">
                    <strong>Peak Load:</strong> {f.peak_load ? `${f.peak_load} kW` : "No Data"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No forecast data available.</Typography>
        )}
      </Grid>

      {/* Energy Consumption Trend (Line Chart) */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Forecast Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="energy" stroke="#8884d8" name="Energy Consumption" />
          <Line type="monotone" dataKey="peakLoad" stroke="#ff7300" name="Peak Load" />
        </LineChart>
      </ResponsiveContainer>

      {/* Total Energy Forecasted (Bar Chart) */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Energy Forecast Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="energy" fill="#82ca9d" name="Energy Consumption" />
          <Bar dataKey="peakLoad" fill="#ff7300" name="Peak Load" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Dashboard;
