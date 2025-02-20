import { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Grid, Divider } from "@mui/material";
import { Line, Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const ForecastData = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/userforecast", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }

        const data = await response.json();
        console.log("Forecast Data:", data); // Debugging Log
        setForecast(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!forecast) return <Alert severity="info">No forecast data available.</Alert>;

  // Ensure data is available
  const hvacUsage = forecast?.hvac_usage || 0;
  const lightingUsage = forecast?.lighting_usage || 0;
  const totalEnergyConsumption = forecast?.total_energy_consumption || 0;
  const avgEnergyConsumption = forecast?.average_energy_consumption || 0;
  const peakLoad = forecast?.peak_load || 0;
  const totalEnergySavings = forecast?.total_energy_savings || 0;
  const highestContributor = forecast?.highest_contributor || "N/A";

  console.log("HVAC Usage:", hvacUsage); // Debugging Log
  console.log("Lighting Usage:", lightingUsage); // Debugging Log

  const timestamps = forecast.forecast_data.map(entry => new Date(entry.timestamp).toLocaleString());
  const energyValues = forecast.forecast_data.map(entry => entry.forecast_energy);
  const energySavings = forecast.forecast_data.map(entry => entry.energy_savings);

  const pieData = {
    labels: ["HVAC Usage", "Lighting Usage"],
    datasets: [
      {
        data: hvacUsage || lightingUsage ? [hvacUsage, lightingUsage] : [1, 1], // Prevent empty chart
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: "Forecast Energy (kWh)",
        data: energyValues,
        borderColor: "#3e95cd",
        fill: false,
      },
      {
        label: "Energy Savings (kWh)",
        data: energySavings,
        borderColor: "#8e5ea2",
        fill: false,
      },
    ],
  };

  const barData = {
    labels: ["HVAC Usage", "Lighting Usage"],
    datasets: [
      {
        label: "Usage Frequency",
        data: hvacUsage || lightingUsage ? [hvacUsage, lightingUsage] : [1, 1], // Prevent empty chart
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <Grid container spacing={3} sx={{ mt: 4, px: 2 }}>
      {/* Summary Card */}
      <Grid item xs={12}>
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Energy Summary</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body1"><strong>Total Energy Consumption:</strong> {totalEnergyConsumption} kWh</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body1"><strong>Average Energy Consumption:</strong> {avgEnergyConsumption} kWh</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body1"><strong>Peak Load:</strong> {peakLoad} kWh</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body1"><strong>Total Energy Savings:</strong> {totalEnergySavings} kWh</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body1"><strong>Highest Contributor:</strong> {highestContributor}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Left Side - Forecast Data */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Your Energy Forecast</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Forecast Data:
            </Typography>
            <List>
              {forecast.forecast_data.map((entry, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Timestamp: ${new Date(entry.timestamp).toLocaleString()}`}
                    secondary={`Forecast Energy: ${entry.forecast_energy} kWh | Energy Savings: ${entry.energy_savings} kWh`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Other Stats */}
        <Card sx={{ mt: 3, p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Other Stats</Typography>
            <Bar data={barData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side - Charts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Energy Consumption Trend
            </Typography>
            <Line data={lineData} />
          </CardContent>
        </Card>

        <Card sx={{ mt: 3, p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contributor Breakdown
            </Typography>
            <Pie data={pieData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForecastData;
