import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Paper,
  useTheme,
  alpha
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import BoltIcon from '@mui/icons-material/Bolt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SavingsIcon from '@mui/icons-material/Savings';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styled } from '@mui/material/styles';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fdf8 100%)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  }
}));

const StatCard = styled(StyledPaper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 160,
  justifyContent: 'center',
}));

// Custom color palette
const COLORS = {
  primary: '#7FB069',
  secondary: '#98C9A3',
  tertiary: '#B5E4BC',
  quaternary: '#D4F2D2',
  accent: '#5D8233',
};

const UserForecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get("http://localhost:5000/userforecast", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setForecastData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No forecast available yet.");
        } else {
          setError("Failed to fetch forecast data.");
        }
      } finally {
        setLoading(false);
      }
    };    
    fetchForecast();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={60} thickness={4} sx={{ color: COLORS.primary }} />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <Typography color="error" variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <QueryStatsIcon /> {error}
      </Typography>
    </Box>
  );

  if (!forecastData || Object.keys(forecastData).length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color={COLORS.accent}>No forecast data available yet</Typography>
      </Box>
    );
  }

  const { total_forecasts, total_energy, total_savings, avg_peak_load, min_peak_load, max_peak_load, avg_factors, energy_by_weekday } = forecastData;

  const energyTrendData = Object.keys(energy_by_weekday).map(day => ({
    name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
    energy: energy_by_weekday[day]
  }));

  const factorData = Object.keys(avg_factors).map(key => ({
    name: key, 
    value: avg_factors[key]
  }));

  return (
    <Box sx={{ p: 3, backgroundColor: alpha(COLORS.quaternary, 0.1) }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: COLORS.accent, 
        fontWeight: 600,
        mb: 4,
        textAlign: 'center'
      }}>
        Energy Forecast Dashboard
      </Typography>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <BoltIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Total Forecasts</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{total_forecasts}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <QueryStatsIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Total Energy Usage</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{total_energy} kWh</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <SavingsIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Total Savings</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{total_savings} kWh</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Peak Load Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <SpeedIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Avg Peak Load</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{avg_peak_load} kW</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <TrendingDownIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Min Peak Load</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{min_peak_load} kW</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard>
            <TrendingUpIcon sx={{ fontSize: 40, color: COLORS.primary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Max Peak Load</Typography>
            <Typography variant="h4" sx={{ color: COLORS.accent, mt: 1 }}>{max_peak_load} kW</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.accent }}>Weekly Energy Consumption</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyTrendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.accent }}>Energy Savings Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Total Savings", value: total_savings }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: `1px solid ${COLORS.secondary}`,
                    borderRadius: 8
                  }}
                />
                <Bar dataKey="value" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 3, color: COLORS.accent, textAlign: 'center' }}>
              Factor Contributions Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie 
                  data={factorData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={150}
                  innerRadius={60}
                  fill={COLORS.primary}
                  dataKey="value"
                  label
                >
                  {factorData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: 8
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForecast;
