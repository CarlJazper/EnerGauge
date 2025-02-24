import React, { useState } from "react";
import { Button, TextField, Box, Typography, Grid, MenuItem, Alert, CircularProgress } from "@mui/material";
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
                DayOfWeek: futureDate.getDay(),
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
        <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
            <Typography variant="h4" gutterBottom>
                Energy Forecasting
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Days to Forecast"
                        type="number"
                        value={days === null ? "" : days}  // Allow empty input
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                                setDays(null); // Allow clearing the input
                            } else {
                                setDays(Math.max(1, parseInt(value, 10) || 1));
                            }
                        }}
                        fullWidth
                    />
                </Grid>
                {Object.keys(inputs).map((key) => (
                    <Grid item xs={12} sm={6} key={key}>
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
            <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ mt: 3, width: "100%" }}>
                {loading ? <CircularProgress size={24} /> : "Get Forecast"}
            </Button>
            {forecastData && (
                <Box sx={{ mt: 4 }}>
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

                    {/* Feature Contribution Breakdown */}
                    <Typography variant="h6" sx={{ mt: 3 }}>Energy Predictions</Typography>
                    {forecastData.forecast_data.map((entry, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
                            <Typography variant="subtitle1">Day {index + 1} - Total Energy: {entry.forecast_energy} kW</Typography>
                            <Grid container spacing={2}>
                                {Object.entries(entry.feature_contributions).map(([feature, value]) => (
                                    <Grid item xs={6} sm={4} key={feature}>
                                        <Typography variant="body2"><strong>{feature}:</strong> {value} kW</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Forecast;
