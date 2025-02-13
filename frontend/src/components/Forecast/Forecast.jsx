import React, { useState } from "react";
import { Button, TextField, Box, Typography, Grid, MenuItem } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

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

    const handleChange = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setForecastData(null);
    
        const futureTimestamps = [];
        const featureInputs = [];
    
        for (let i = 0; i < days; i++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + i);
            futureTimestamps.push(futureDate.toISOString().split("T")[0]);
    
            featureInputs.push({
                Temperature: parseFloat(inputs.Temperature) || 22.5,
                Humidity: parseFloat(inputs.Humidity) || 60,
                SquareFootage: parseFloat(inputs.SquareFootage) || 1200,
                Occupancy: parseInt(inputs.Occupancy, 10) || 5,
                HVACUsage: inputs.HVACUsage === "On" ? 1 : 0,
                LightingUsage: inputs.LightingUsage === "On" ? 1 : 0,
                RenewableEnergy: parseFloat(inputs.RenewableEnergy) || 50,
                DayOfWeek: futureDate.getDay(),
                Holiday: inputs.Holiday === "Yes" ? 1 : 0
            });
        }
    
        const requestData = { timestamps: futureTimestamps, features: featureInputs };
    
        try {
            const response = await axios.post("http://localhost:5000/predict_forecast", requestData, {
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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
                Energy Forecasting
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Days to Forecast"
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        fullWidth
                    />
                </Grid>
                {Object.keys(inputs).map((key) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                        {key === "HVACUsage" || key === "LightingUsage" || key === "Holiday" ? (
                            <TextField
                                select
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                name={key}
                                value={inputs[key]}
                                onChange={handleChange}
                                fullWidth
                            >
                                {key === "Holiday" ? (
                                    ["No", "Yes"].map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))
                                ) : (
                                    ["Off", "On"].map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))
                                )}
                            </TextField>
                        ) : (
                            <TextField
                                label={key.replace(/([A-Z])/g, ' $1').trim()}
                                name={key}
                                type="number"
                                value={inputs[key]}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ marginTop: 2 }}>
                {loading ? "Loading..." : "Get Forecast"}
            </Button>
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
            {forecastData && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">Forecast Results:</Typography>
                    <Typography variant="body1">
                        <strong>Estimated Peak Load:</strong> {forecastData.peak_load} kW
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formatForecastData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="energyConsumption" stroke="#8884d8" name="Energy Consumption" />
                            <Line type="monotone" dataKey="energySavings" stroke="#82ca9d" name="Energy Savings" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
};

export default Forecast;
