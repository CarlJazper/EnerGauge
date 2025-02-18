import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Tooltip } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import Loader from "../../layouts/Loader";
import axios from "axios";
import { EnergySavingsLeaf, TrendingUp, Bolt, Savings, Info } from "@mui/icons-material";

const Forecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalEnergySavings, setTotalEnergySavings] = useState(0);
  const [averagePeakLoad, setAveragePeakLoad] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/trends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data.forecasts);
        setTotalPredictions(response.data.total_forecasts);
        setTotalEnergy(response.data.total_energy);
        setTotalEnergySavings(response.data.total_energy_savings);
        setAveragePeakLoad(response.data.average_peak_load);
      })
      .catch((error) => console.error("Error fetching forecast data", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  const chartData = forecasts.map((f) => ({
    date: f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "Unknown",
    energy: f.total_forecast_energy || 0,
    energySavings: f.total_energy_savings || 0,
    peakLoad: f.peak_load || 0,
  }));

  return (
    <Container sx={{ mt: 4 }}>
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
        <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                height: 150, // Fixed height to ensure uniformity
              }}
          >
          {item.icon}
          <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", fontSize: "0.9rem" }}>
              {item.title}
              {item.tooltip && (
               <Tooltip title={item.tooltip}>
                 <Info fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />
               </Tooltip>
               )}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
               {item.value}
             </Typography>
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
    </Container>
  );
};

export default Forecast;
