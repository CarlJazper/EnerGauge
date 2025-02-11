import { useState } from "react";
import { Button, Box, Card, Typography, Alert, CircularProgress, Grid } from "@mui/material";
import axios from "axios";

const TrainModel = () => {
  const [file, setFile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTrain = async () => {
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    setError("");
    setMetrics(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // Get JWT token

      const response = await axios.post("http://localhost:5000/train_rfr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMetrics(response.data.metrics);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while training.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Upload & Training Results Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Train Energy Model
            </Typography>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleTrain}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Train Model"}
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            
            {/* Training Results Inside the Card */}
            {metrics && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Training Results
                </Typography>
                <Typography variant="body1"><strong>R² Score:</strong> {metrics["R2 Score"].toFixed(4)}</Typography>
                <Typography variant="body1"><strong>MAE:</strong> {metrics["MAE"].toFixed(4)} kWh</Typography>
                <Typography variant="body1"><strong>RMSE:</strong> {metrics["RMSE"].toFixed(4)} kWh</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Information Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              How the Model Works
            </Typography>
            <Typography variant="body1" gutterBottom>
              The model used is a <strong>Random Forest Regressor</strong>, trained to predict energy consumption.
              It learns patterns from historical data containing features like Temperature, Humidity, Occupancy, etc.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Required columns:
            </Typography>
            <ul>
              <li>Temperature, Humidity, SquareFootage</li>
              <li>Occupancy, HVACUsage, LightingUsage</li>
              <li>RenewableEnergy, DayOfWeek, Holiday</li>
            </ul>
            <Typography variant="body1" gutterBottom>
              <strong>Training Metrics:</strong>
            </Typography>
            <ul>
              <li><strong>R² Score:</strong> Measures model accuracy (1.0 = perfect fit).</li>
              <li><strong>MAE (Mean Absolute Error):</strong> Average absolute error in kWh.</li>
              <li><strong>RMSE (Root Mean Square Error):</strong> Penalizes large errors more heavily.</li>
            </ul>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainModel;
