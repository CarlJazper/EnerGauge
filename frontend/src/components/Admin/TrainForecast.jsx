import React, { useState } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
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
                <Typography sx={{ marginTop: 2, color: "red" }}>{message}</Typography>
            )}
        </Box>
    );
};

export default TrainForecast;
