import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Pagination, Tooltip } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, } from "recharts";
import Loader from "../layouts/Loader";
import axios from "axios";
import { EnergySavingsLeaf, TrendingUp, Bolt, Savings, Info } from "@mui/icons-material";

const Dashboard = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalEnergySavings, setTotalEnergySavings] = useState(0);
  const [averagePeakLoad, setAveragePeakLoad] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/trends?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data.forecasts);
        setTotalPredictions(response.data.total_forecasts);
        setTotalEnergy(response.data.total_energy);
        setTotalEnergySavings(response.data.total_energy_savings);
        setAveragePeakLoad(response.data.average_peak_load);
        setTotalPages(Math.ceil(response.data.total_forecasts / perPage));
      })
      .catch((error) => console.error("Error fetching forecast data", error))
      .finally(() => setLoading(false));
  }, [page, perPage]);

  if (loading) {
    return <Loader />;
  }

  const chartData = forecasts.map((f) => ({
    date: f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "Unknown",
    energy: f.total_forecast_energy || 0,
    energySavings: f.total_energy_savings || 0,
    peakLoad: f.peak_load || 0,
  }));

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {[{
          title: "Total Forecast Prediction", value: totalPredictions, icon: <TrendingUp fontSize="large" color="primary" />
        }, {
          title: "Total Energy Forecasted (All Days)", 
          value: `${totalEnergy.toFixed(2)} kWh`, 
          icon: <EnergySavingsLeaf fontSize="large" color="success" />,
          tooltip: "Sum of energy consumption for all days forecasted by users"
        }, {
          title: "Total Energy Savings", 
          value: `${totalEnergySavings.toFixed(2)} kWh`, 
          icon: <Savings fontSize="large" color="info" />,
          tooltip: "Sum of energy savings for all days forecasted by users"
        }, {
          title: "Average Peak Load", 
          value: `${averagePeakLoad.toFixed(2)} kW`, 
          icon: <Bolt fontSize="large" color="warning" />,
          tooltip: "Average peak load across all forecasts"
        }].map((item, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3, borderRadius: 2 }}>
              {item.icon}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {item.title}
                  <Tooltip title={item.tooltip}>
                    <Info fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
                  </Tooltip>
                </Typography>
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
          <RechartsTooltip />
          <Line type="monotone" dataKey="energy" stroke="#8884d8" name="Energy Consumption" strokeWidth={2} />
          <Line type="monotone" dataKey="energySavings" stroke="#82ca9d" name="Energy Savings" strokeWidth={2} />
          <Line type="monotone" dataKey="peakLoad" stroke="#ff7300" name="Peak Load" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Recent Forecasts
      </Typography>
      <Grid container spacing={2}>
        {forecasts.length > 0 ? (
          forecasts.map((f, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1"><strong>Date:</strong> {f.timestamp ? new Date(f.timestamp).toLocaleString() : "Unknown Date"}</Typography>
                  <Typography variant="body1">
                    <strong>Energy Consumption:</strong> {f.total_forecast_energy.toFixed(2)} kWh (over {f.forecast_data.length} days)
                  </Typography>
                  <Typography variant="body1">
                    <strong>Energy Savings:</strong> {f.total_energy_savings.toFixed(2)} kWh
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
      <Pagination count={totalPages} page={page} onChange={handleChangePage} sx={{ mt: 2, display: "flex", justifyContent: "center" }} />
    </Container>
  );
};

export default Dashboard;