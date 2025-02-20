import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, CircularProgress, MenuItem, Select } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const UserForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [avgPeakLoad, setAvgPeakLoad] = useState(0);
  const [minPeakLoad, setMinPeakLoad] = useState(0);
  const [maxPeakLoad, setMaxPeakLoad] = useState(0);

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/userforecast", {
        params: { start_date: startDate, end_date: endDate },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const { forecasts } = response.data;
      setForecasts(forecasts);

      if (forecasts.length > 0) {
        setSelectedForecast(forecasts[0]);
        updateStats(forecasts[0]);
      } else {
        setSelectedForecast(null);
      }
    } catch (error) {
      console.error("Error fetching forecasts:", error);
      setForecasts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForecasts();
  }, [startDate, endDate]); // Trigger fetch when date filters change

  const handleFilter = () => {
    fetchForecasts();
  };

  const handleForecastChange = (event) => {
    const forecast = forecasts.find(f => f.timestamp === event.target.value);
    setSelectedForecast(forecast);
    updateStats(forecast);
  };

  const updateStats = (forecast) => {
    if (!forecast) return;

    const totalEnergy = forecast.forecast_data.reduce((sum, entry) => sum + entry.forecast_energy, 0);
    const totalSavings = forecast.forecast_data.reduce((sum, entry) => sum + entry.energy_savings, 0);
    const peakLoads = forecast.forecast_data.map(entry => entry.peak_load);

    setTotalEnergy(totalEnergy.toFixed(2));
    setTotalSavings(totalSavings.toFixed(2));
    setAvgPeakLoad(peakLoads.length ? (peakLoads.reduce((a, b) => a + b, 0) / peakLoads.length).toFixed(2) : 0);
    setMinPeakLoad(peakLoads.length ? Math.min(...peakLoads).toFixed(2) : 0);
    setMaxPeakLoad(peakLoads.length ? Math.max(...peakLoads).toFixed(2) : 0);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>User Forecast Dashboard</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleFilter} fullWidth>Filter</Button>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {forecasts.length > 0 && (
            <Box my={2}>
              <Typography>Select Forecast:</Typography>
              <Select fullWidth value={selectedForecast?.timestamp || ""} onChange={handleForecastChange}>
                {forecasts.map(forecast => (
                  <MenuItem key={forecast.timestamp} value={forecast.timestamp}>{forecast.timestamp}</MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {selectedForecast && (
            <Box my={3}>
              <Typography variant="h6">Forecast Summary</Typography>
              <Typography>Total Forecasted Energy: {totalEnergy} kWh</Typography>
              <Typography>Total Energy Savings: {totalSavings} kWh</Typography>
              <Typography>Average Peak Load: {avgPeakLoad} kWh</Typography>
              <Typography>Min Peak Load: {minPeakLoad} kWh</Typography>
              <Typography>Max Peak Load: {maxPeakLoad} kWh</Typography>
            </Box>
          )}

          {selectedForecast && (
            <Box my={3}>
              <Typography variant="h6">Forecasted Energy Consumption</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedForecast.forecast_data}>
                  <XAxis dataKey="timestamp" tickFormatter={(date) => date.split("T")[0]} />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="forecast_energy" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UserForecast;
