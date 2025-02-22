import React, { useState } from "react";
import { Button, Box, CircularProgress, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";

const TrainForecast = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage("Please upload a CSV file.");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:5000/train_arima", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Error training the model");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {/* Left Section: Upload & Results */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Train Energy Forecasting Model
                        </Typography>
                        <input type="file" onChange={handleFileChange} />
                        <Box sx={{ marginTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Train Model"}
                            </Button>
                        </Box>
                        {message && (
                            <Typography sx={{ marginTop: 2, color: "green" }}>{message}</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Right Section: Model Explanation */}
                <Grid item xs={12} md={6}>
    <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
            How the Model Works
        </Typography>
        <Typography variant="body2">
            The SARIMAX model (Seasonal AutoRegressive Integrated Moving Average with Exogenous 
            Variables) is used for time series forecasting. It extends ARIMA by incorporating 
            seasonal patterns and external factors such as temperature, humidity, and occupancy 
            to improve prediction accuracy. This model helps in capturing trends, periodic fluctuations, 
            and the influence of external variables on energy consumption.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Required Columns in CSV
        </Typography>
        <Typography variant="body2">
            The CSV file should contain the following columns:
        </Typography>
        <ul>
            <li><strong>Temperature</strong> - Outdoor temperature</li>
            <li><strong>Humidity</strong> - Humidity percentage</li>
            <li><strong>SquareFootage</strong> - Size of the area</li>
            <li><strong>Occupancy</strong> - Number of people present</li>
            <li><strong>HVACUsage</strong> - Energy used by HVAC</li>
            <li><strong>LightingUsage</strong> - Energy used for lighting</li>
            <li><strong>RenewableEnergy</strong> - Renewable energy contribution</li>
            <li><strong>DayOfWeek</strong> - Categorical day (Monday-Sunday)</li>
            <li><strong>Holiday</strong> - Whether the day is a holiday (0/1)</li>
        </ul>
    </Paper>
</Grid>

            </Grid>
        </Box>
    );
};

export default TrainForecast;
