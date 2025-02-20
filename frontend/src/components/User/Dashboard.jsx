import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";
import ForecastData from "../User/ForecastData"; // Adjust path if needed

const Dashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Dashboard Title */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Forecast Data Section - Now full-width */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, boxShadow: 4, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Your Energy Forecast
            </Typography>
            <ForecastData />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
