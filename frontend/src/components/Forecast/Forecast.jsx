import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Forecast = () => {
    const [days, setDays] = useState(7);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDaysChange = (event) => {
        setDays(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setForecast(null);

        try {
            const response = await axios.get('http://localhost:5000/predict_demand', {
                params: { days },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setForecast(response.data.predictions);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching predictions');
        } finally {
            setLoading(false);
        }
    };

    const formatForecastData = () => {
        if (!forecast) return [];
        return forecast.map((demand, index) => ({
            day: `Day ${index + 1}`,
            demand: Number(demand)
        }));
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Demand Forecast
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
                {loading ? 'Loading...' : 'Get Forecast'}
            </Button>
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
            {forecast && (
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Forecast Results:</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formatForecastData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="demand" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
};

export default Forecast;