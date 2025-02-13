import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const Forecast = () => {
    const [days, setDays] = useState(7);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDaysChange = (event) => {
        setDays(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setForecastData(null);

        try {
            const response = await axios.get("http://localhost:5000/predict_forecast", {
                params: { days },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setForecastData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching predictions");
        } finally {
            setLoading(false);
        }
    };

    const formatForecastData = () => {
        if (!forecastData) return [];

        return forecastData.forecast_energy.map((consumption, index) => ({
            day: `Day ${index + 1}`,
            energyConsumption: Number(consumption),
            energySavings: Number(forecastData.energy_savings[index]),
        }));
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
                Energy Forecasting
            </Typography>
            <TextField
                label="Days to Forecast"
                type="number"
                value={days}
                onChange={handleDaysChange}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
            >
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
