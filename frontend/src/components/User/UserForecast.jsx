import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Grid, CircularProgress, MenuItem, Select } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const UserForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [avgPeakLoad, setAvgPeakLoad] = useState(0);
  const [minPeakLoad, setMinPeakLoad] = useState(0);
  const [maxPeakLoad, setMaxPeakLoad] = useState(0);
  const [energyByWeekday, setEnergyByWeekday] = useState({});
  const [avgFeatureContributions, setAvgFeatureContributions] = useState({});

  // Fetch forecasts and calculate summary stats
  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/userforecast", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const { forecasts } = response.data;
      setForecasts(forecasts);

      if (forecasts.length > 0) {
        setSelectedForecast(forecasts[0]);
        updateStats(forecasts);
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
  }, []); // Fetch on page load

  const updateStats = (forecasts) => {
    let totalEnergy = 0;
    let totalSavings = 0;
    let peakLoads = [];
    let energyByWeekday = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let factorSums = {
      "Temperature": 0, "Humidity": 0, "SquareFootage": 0, "Occupancy": 0,
      "HVACUsage": 0, "LightingUsage": 0, "RenewableEnergy": 0, "Holiday": 0
    };
    let factorCounts = { ...factorSums };

    forecasts.forEach(forecast => {
      forecast.forecast_data.forEach(entry => {
        totalEnergy += entry.forecast_energy;
        totalSavings += entry.energy_savings;
        peakLoads.push(entry.peak_load);

        // Energy by weekday
        const weekday = new Date(entry.timestamp).getDay();
        energyByWeekday[weekday] += entry.forecast_energy;

        // Factor contributions
        Object.keys(factorSums).forEach(key => {
          if (entry.features[key] !== undefined) {
            factorSums[key] += entry.features[key];
            factorCounts[key] += 1;
          }
        });
      });
    });

    // Average calculations
    const avgPeakLoad = peakLoads.length ? (peakLoads.reduce((a, b) => a + b, 0) / peakLoads.length).toFixed(2) : 0;
    const avgFactors = Object.keys(factorSums).reduce((acc, key) => {
      acc[key] = factorCounts[key] > 0 ? (factorSums[key] / factorCounts[key]).toFixed(2) : 0;
      return acc;
    }, {});

    setTotalEnergy(totalEnergy.toFixed(2));
    setTotalSavings(totalSavings.toFixed(2));
    setAvgPeakLoad(avgPeakLoad);
    setMinPeakLoad(Math.min(...peakLoads).toFixed(2));
    setMaxPeakLoad(Math.max(...peakLoads).toFixed(2));
    setEnergyByWeekday(energyByWeekday);
    setAvgFeatureContributions(avgFactors);
  };

  const handleForecastChange = (event) => {
    const forecast = forecasts.find(f => f.timestamp === event.target.value);
    setSelectedForecast(forecast);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>User Forecast Dashboard</Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          <Box my={3}>
            <Typography variant="h6">Summary Overview</Typography>
            <Typography>Total Forecasted Energy: {totalEnergy} kWh</Typography>
            <Typography>Total Energy Savings: {totalSavings} kWh</Typography>
            <Typography>Average Peak Load: {avgPeakLoad} kWh</Typography>
            <Typography>Min Peak Load: {minPeakLoad} kWh</Typography>
            <Typography>Max Peak Load: {maxPeakLoad} kWh</Typography>
            <Typography variant="h6" mt={3}>Energy by Weekday</Typography>
            <Grid container spacing={2}>
              {Object.keys(energyByWeekday).map(day => (
                <Grid item xs={2} key={day}>
                  <Typography>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}</Typography>
                  <Typography>{energyByWeekday[day]} kWh</Typography>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" mt={3}>Average Feature Contributions</Typography>
            {Object.keys(avgFeatureContributions).map(key => (
              <Typography key={key}>{key}: {avgFeatureContributions[key]} kWh</Typography>
            ))}
          </Box>

          <Box my={3}>
            <Typography>Select Forecast:</Typography>
            <Select fullWidth value={selectedForecast?.timestamp || ""} onChange={handleForecastChange}>
              {forecasts.map(forecast => (
                <MenuItem key={forecast.timestamp} value={forecast.timestamp}>{forecast.timestamp}</MenuItem>
              ))}
            </Select>
          </Box>

          {selectedForecast && (
            <>
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

              <Box my={3}>
                <Typography variant="h6">Energy Savings</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedForecast.forecast_data}>
                    <XAxis dataKey="timestamp" tickFormatter={(date) => date.split("T")[0]} />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Bar dataKey="energy_savings" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default UserForecast;
