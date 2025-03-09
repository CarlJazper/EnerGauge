import React, { useState } from "react";
import { 
    Button, 
    Box, 
    CircularProgress, 
    Typography, 
    Grid, 
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    CloudUpload,
    ThermostatAuto,
    WaterDrop,
    Square,
    Group,
    AcUnit,
    LightbulbCircle,
    WindPower,
    Today,
    Event,
    ModelTraining,
    InfoOutlined
} from '@mui/icons-material';
import axios from "axios";

// Green pastel theme colors
const theme = {
    primary: '#88B788',    // Soft green
    secondary: '#D4E6D4',  // Light pastel green
    hover: '#709C70',      // Darker green for hover
    background: '#F5F9F5', // Very light green background
    text: '#2E5B2E',       // Dark green text
    error: '#E6A5A5',      // Soft red for errors
    success: '#A5E6B0'     // Soft green for success
};

const TrainForecast = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setMessage("Please upload a CSV file.");
            setMessageType("error");
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
            setMessageType("success");
        } catch (error) {
            setMessage(error.response?.data?.error || "Error training the model");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Custom styled Paper component
    const StyledPaper = ({ children, ...props }) => (
        <Paper
            {...props}
            sx={{
                padding: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                backgroundColor: theme.background,
                border: `1px solid ${theme.secondary}`,
                ...props.sx
            }}
        >
            {children}
        </Paper>
    );

    // Custom Button style
    const buttonStyle = {
        backgroundColor: theme.primary,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.hover,
        },
        padding: '10px 20px',
        borderRadius: '8px',
        textTransform: 'none',
        fontSize: '1rem',
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#FAFAFA' }}>
            <Grid container spacing={4}>
                {/* Left Section: Upload & Results */}
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <ModelTraining sx={{ fontSize: 40, color: theme.primary, mb: 2 }} />
                            <Typography variant="h5" gutterBottom sx={{ color: theme.text, fontWeight: 600 }}>
                                Train Energy Forecasting Model
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                border: `2px dashed ${theme.primary}`,
                                borderRadius: 2,
                                padding: 3,
                                textAlign: 'center',
                                mb: 3,
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: theme.secondary }
                            }}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                                accept=".csv"
                            />
                            <label htmlFor="file-upload">
                                <CloudUpload sx={{ fontSize: 40, color: theme.primary, mb: 1 }} />
                                <Typography variant="body1" sx={{ color: theme.text }}>
                                    {file ? file.name : "Click to upload CSV file"}
                                </Typography>
                            </label>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <ModelTraining />}
                                sx={buttonStyle}
                            >
                                {loading ? "Training..." : "Train Model"}
                            </Button>
                        </Box>

                        {message && (
                            <Typography 
                                sx={{ 
                                    marginTop: 2, 
                                    color: messageType === "error" ? theme.error : theme.success,
                                    textAlign: 'center',
                                    padding: 1,
                                    borderRadius: 1
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                    </StyledPaper>
                </Grid>

                {/* Right Section: Model Explanation */}
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <InfoOutlined sx={{ color: theme.primary, mr: 1 }} />
                            <Typography variant="h6" sx={{ color: theme.text }}>
                                How the Model Works
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: theme.text, mb: 3 }}>
                            The SARIMAX model (Seasonal AutoRegressive Integrated Moving Average with Exogenous 
                            Variables) is used for time series forecasting. It extends ARIMA by incorporating 
                            seasonal patterns and external factors to improve prediction accuracy.
                        </Typography>

                        <Typography variant="h6" sx={{ color: theme.text, mb: 2 }}>
                            Required CSV Columns
                        </Typography>

                        <List>
                            <ListItem>
                                <ListItemIcon><ThermostatAuto sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="Temperature" secondary="Outdoor temperature" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><WaterDrop sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="Humidity" secondary="Humidity percentage" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Square sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="SquareFootage" secondary="Size of the area" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Group sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="Occupancy" secondary="Number of people present" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><AcUnit sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="HVACUsage" secondary="Energy used by HVAC" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><LightbulbCircle sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="LightingUsage" secondary="Energy used for lighting" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><WindPower sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="RenewableEnergy" secondary="Renewable energy contribution" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Today sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="DayOfWeek" secondary="Categorical day (Monday-Sunday)" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Event sx={{ color: theme.primary }} /></ListItemIcon>
                                <ListItemText primary="Holiday" secondary="Whether the day is a holiday (0/1)" />
                            </ListItem>
                        </List>
                    </StyledPaper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TrainForecast;
