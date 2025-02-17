import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import Loader from "../../layouts/Loader";

const RecentForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/trends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data.forecasts);
      })
      .catch((error) => console.error("Error fetching forecast data", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Recent Forecasts
      </Typography>
      <Grid container spacing={2}>
        {forecasts.length > 0 ? (
          forecasts.map((f, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 2, boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    <strong>Date:</strong> {f.timestamp ? new Date(f.timestamp).toLocaleString() : "Unknown Date"}
                  </Typography>
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
    </Container>
  );
};

export default RecentForecast;
