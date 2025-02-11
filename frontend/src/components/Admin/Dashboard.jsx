import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Pagination } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Loader from "../layouts/Loader";
import axios from "axios";
import { EnergySavingsLeaf, TrendingUp, Bolt } from "@mui/icons-material";

const Dashboard = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [averagePeakLoad, setAveragePeakLoad] = useState(0);
  const [page, setPage] = useState(1);
  const forecastsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5000/trends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data);
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

  const chartData = forecasts.map((f) => ({
    date: f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "Unknown",
    energy: f.forecast_energy?.reduce((a, b) => a + b, 0) || 0,
    peakLoad: f.peak_load || 0,
  }));

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const displayedForecasts = forecasts.slice((page - 1) * forecastsPerPage, page * forecastsPerPage);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {[{
          title: "Total Forecast Prediction", value: totalPredictions, icon: <TrendingUp fontSize="large" color="primary" />
        }, {
          title: "Total Energy Forecasted", value: `${totalEnergy.toFixed(2)} kWh`, icon: <EnergySavingsLeaf fontSize="large" color="success" />
        }, {
          title: "Average Peak Load", value: `${averagePeakLoad.toFixed(2)} kW`, icon: <Bolt fontSize="large" color="warning" />
        }].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, borderRadius: 2 }}>
              {item.icon}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>{item.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Forecast Trends
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="energy" stroke="#8884d8" name="Energy Consumption" strokeWidth={2} />
          <Line type="monotone" dataKey="peakLoad" stroke="#ff7300" name="Peak Load" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
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

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Recent Forecasts
      </Typography>
      <Grid container spacing={2}>
        {displayedForecasts.length > 0 ? (
          displayedForecasts.map((f, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1"><strong>Date:</strong> {f.timestamp ? new Date(f.timestamp).toLocaleString() : "Unknown Date"}</Typography>
                  <Typography variant="body1"><strong>Energy Consumption:</strong> {f.forecast_energy?.reduce((a, b) => a + b, 0).toFixed(2) || "No Data"} kWh</Typography>
                  <Typography variant="body1"><strong>Peak Load:</strong> {f.peak_load ? `${f.peak_load} kW` : "No Data"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No forecast data available.</Typography>
        )}
      </Grid>
      <Pagination count={Math.ceil(forecasts.length / forecastsPerPage)} page={page} onChange={handleChangePage} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
    </Container>
  );
};

export default Dashboard;
