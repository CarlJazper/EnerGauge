import React, { useState } from "react";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Grid, 
  MenuItem, 
  Alert, 
  CircularProgress,
  Paper,
  Divider,
  alpha
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { styled } from '@mui/material/styles';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CelebrationIcon from '@mui/icons-material/Celebration';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

// Custom color palette
const COLORS = {
  primary: '#7FB069',
  secondary: '#98C9A3',
  tertiary: '#B5E4BC',
  quaternary: '#D4F2D2',
  accent: '#5D8233',
  error: '#FF6B6B',
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fdf8 100%)',
  transition: 'transform 0.2s ease-in-out',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: COLORS.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.primary,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: COLORS.primary,
  },
});

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${alpha(COLORS.primary, 0.2)}`,
  background: alpha(COLORS.quaternary, 0.1),
  marginBottom: theme.spacing(2),
}));

const Forecast = () => {
    const [inputs, setInputs] = useState({
        Temperature: "",
        Humidity: "",
        SquareFootage: "",
        Occupancy: "",
        HVACUsage: "Off",
        LightingUsage: "Off",
        RenewableEnergy: "",
        DayOfWeek: "",
        Holiday: "No"
    });
    const [days, setDays] = useState(1);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const inputIcons = {
        Temperature: <ThermostatIcon />,
        Humidity: <WaterDropIcon />,
        SquareFootage: <HomeIcon />,
        Occupancy: <GroupIcon />,
        HVACUsage: <AcUnitIcon />,
        LightingUsage: <LightbulbIcon />,
        RenewableEnergy: <SolarPowerIcon />,
        DayOfWeek: <CalendarTodayIcon />,
        Holiday: <CelebrationIcon />
    };

    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };


    const handleSubmit = async () => {
        setError("");
        setForecastData(null);

        if (!days || days < 1) {
            setError("Please enter a valid number of days to forecast.");
            return;
        }

        const missingFields = Object.keys(inputs).filter((key) => inputs[key] === "");
        if (missingFields.length > 0) {
            setError(`Please fill in all fields: ${missingFields.join(", ")}`);
            return;
        }

        setLoading(true);

        const futureTimestamps = [];
        const featureInputs = [];

        for (let i = 0; i < parseInt(days, 10); i++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + i);
            futureTimestamps.push(futureDate.toISOString().split("T")[0]);

            featureInputs.push({
                Temperature: parseFloat(inputs.Temperature),
                Humidity: parseFloat(inputs.Humidity),
                SquareFootage: parseFloat(inputs.SquareFootage),
                Occupancy: parseInt(inputs.Occupancy, 10),
                HVACUsage: inputs.HVACUsage === "On" ? 1 : 0,
                LightingUsage: inputs.LightingUsage === "On" ? 1 : 0,
                RenewableEnergy: parseFloat(inputs.RenewableEnergy),
                DayOfWeek: inputs.DayOfWeek !== "" ? parseInt(inputs.DayOfWeek, 10) : futureDate.getDay(),
                Holiday: inputs.Holiday === "Yes" ? 1 : 0
            });
        }

        try {
            const response = await axios.post("http://localhost:5000/predict_forecast", {
                timestamps: futureTimestamps,
                features: featureInputs,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setForecastData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Error fetching predictions");
        } finally {
            setLoading(false);
        }
    };

    const formatForecastData = () => {
        if (!forecastData) return [];
        return forecastData.forecast_data.map((entry, index) => ({
            day: `Day ${index + 1}`,
            energyConsumption: Number(entry.forecast_energy),
            energySavings: Number(entry.energy_savings),
        }));
    };

    return (
        <Box sx={{ 
            padding: { xs: 2, md: 4 }, 
            maxWidth: 1200, 
            margin: "auto",
            backgroundColor: alpha(COLORS.quaternary, 0.1)
        }}>
            <Typography variant="h4" gutterBottom sx={{ 
                color: COLORS.accent,
                textAlign: 'center',
                fontWeight: 600,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}>
                <QueryStatsIcon sx={{ fontSize: 40 }} />
                Energy Forecasting
            </Typography>

            <StyledPaper elevation={3}>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3, 
                            borderRadius: 2,
                            backgroundColor: alpha(COLORS.error, 0.1)
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Days to Forecast"
                            type="number"
                            value={days === null ? "" : days}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setDays(null);
                                } else {
                                    setDays(Math.max(1, parseInt(value, 10) || 1));
                                }
                            }}
                            fullWidth
                            InputProps={{
                                startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: COLORS.primary }} />,
                            }}
                        />
                    </Grid>

                    {Object.keys(inputs).map((key) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <StyledTextField
                                select={["HVACUsage", "LightingUsage", "Holiday", "DayOfWeek"].includes(key)}
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                name={key}
                                value={inputs[key]}
                                onChange={handleChange}
                                fullWidth
                                type={!["HVACUsage", "LightingUsage", "Holiday", "DayOfWeek"].includes(key) ? "number" : "text"}
                                InputProps={{
                                    startAdornment: inputIcons[key] && React.cloneElement(inputIcons[key], { 
                                        sx: { mr: 1, color: COLORS.primary } 
                                    })
                                }}
                            >
                                {key === "Holiday" && (
                                    ["No", "Yes"].map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))
                                )}
                                {(key === "HVACUsage" || key === "LightingUsage") && (
                                    ["Off", "On"].map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))
                                )}
                                {key === "DayOfWeek" && (
                                    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                                        <MenuItem key={index} value={index}>{day}</MenuItem>
                                    ))
                                )}
                            </StyledTextField>
                        </Grid>
                    ))}
                </Grid>

                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    sx={{ 
                        mt: 4,
                        width: "100%",
                        height: 48,
                        backgroundColor: COLORS.primary,
                        '&:hover': {
                            backgroundColor: alpha(COLORS.primary, 0.9),
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Generate Forecast"}
                </Button>
            </StyledPaper>

            {forecastData && (
                <Box sx={{ mt: 4 }}>
                    <StyledPaper>
                        <Typography variant="h5" sx={{ color: COLORS.accent, mb: 3 }}>
                            Forecast Results
                        </Typography>
                        
                        <Typography variant="h6" sx={{ color: COLORS.primary, mb: 2 }}>
                            Estimated Peak Load: {forecastData.peak_load} kW
                        </Typography>

                        <Box sx={{ height: 400, mb: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formatForecastData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(COLORS.primary, 0.2)} />
                                    <XAxis dataKey="day" />
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
                                        dataKey="energyConsumption" 
                                        stroke={COLORS.primary} 
                                        name="Energy Consumption"
                                        strokeWidth={2}
                                        dot={{ fill: COLORS.primary }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="energySavings" 
                                        stroke={COLORS.secondary} 
                                        name="Energy Savings"
                                        strokeWidth={2}
                                        dot={{ fill: COLORS.secondary }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" sx={{ color: COLORS.accent, mb: 2 }}>
                            Daily Energy Predictions
                        </Typography>

                        {forecastData.forecast_data.map((entry, index) => (
                            <ResultCard key={index}>
                                <Typography variant="subtitle1" sx={{ color: COLORS.accent, mb: 2 }}>
                                    Day {index + 1} - Total Energy: {entry.forecast_energy} kW
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(entry.feature_contributions).map(([feature, value]) => (
                                        <Grid item xs={12} sm={6} md={4} key={feature}>
                                            <Typography variant="body2" sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 1,
                                                color: COLORS.primary
                                            }}>  {inputIcons[feature.split(' ')[0]] || <QueryStatsIcon />}
                                            <strong>{feature}:</strong> {value} kW
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </ResultCard>
                    ))}
                </StyledPaper>
            </Box>
        )}
    </Box>
);
};

export default Forecast;