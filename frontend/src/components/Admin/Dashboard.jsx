import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import Loader from '../layouts/Loader';
import axios from "axios";

const Dashboard = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/trends", { 
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(response => setForecasts(response.data))
    .catch(error => console.error("Error fetching forecast data", error));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Forecasts</Typography>
              {forecasts.length > 0 ? (
                forecasts.map((f, index) => (
                  <Typography key={index}>
                    {f.timestamp 
                      ? new Date(f.timestamp).toLocaleString() 
                      : "Unknown Date"
                    }: {f.forecast.join(", ")}
                  </Typography>
                ))
              ) : (
                <Typography>No forecast data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
