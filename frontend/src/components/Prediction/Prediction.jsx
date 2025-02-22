import { useState } from "react";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Slider, Typography, Grid, Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const GreenPastelPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  backgroundColor: "#e8f5e9",
  borderRadius: "15px",
}));

const GreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#81c784",
  color: theme.palette.getContrastText("#81c784"),
  '&:hover': {
    backgroundColor: "#66bb6a",
  },
}));

const GreenSlider = styled(Slider)(({ theme }) => ({
  color: "#66bb6a",
}));

const Prediction = () => {
  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState({
    Temperature: 0,
    Humidity: 0,
    SquareFootage: 0,
    Occupancy: 0,
    HVACUsage: "Off",
    LightingUsage: "Off",
    RenewableEnergy: 0,
    DayOfWeek: "Monday",
    Holiday: "No",
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setManualInput({ ...manualInput, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name) => (event, value) => {
    setManualInput({ ...manualInput, [name]: value });
  };

  const handlePredict = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        response = await axios.post("http://localhost:5000/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.post("http://localhost:5000/predict", manualInput, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction error.");
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f1f8e9", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ color: "#2e7d32", marginBottom: 3 }}>Energy Consumption Prediction</Typography>

      <GreenPastelPaper elevation={3}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Upload CSV File</Typography>
        <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginBottom: 10 }} />
        <GreenButton variant="contained" onClick={handlePredict} sx={{ ml: 2 }}>
          Predict from File
        </GreenButton>
      </GreenPastelPaper>

      <GreenPastelPaper elevation={3}>
        <Typography variant="h5" sx={{ marginBottom: 3, color: "#2e7d32" }}>
          Or Enter Data Manually
        </Typography>

        <Grid container spacing={3}>
          {/* Temperature Slider */}
          <Grid item xs={12}>
            <Typography>Temperature (°C): {manualInput.Temperature}</Typography>
            <GreenSlider
              value={manualInput.Temperature}
              min={-10}
              max={50}
              step={1}
              onChange={handleSliderChange("Temperature")}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Humidity Slider */}
          <Grid item xs={12}>
            <Typography>Humidity (%): {manualInput.Humidity}</Typography>
            <GreenSlider
              value={manualInput.Humidity}
              min={0}
              max={100}
              step={1}
              onChange={handleSliderChange("Humidity")}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Square Footage Input */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Square Footage"
              name="SquareFootage"
              value={manualInput.SquareFootage}
              onChange={handleInputChange}
              inputProps={{ min: 100 }}
            />
          </Grid>

          {/* Occupancy Input */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Occupancy"
              name="Occupancy"
              value={manualInput.Occupancy}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* HVAC Usage Dropdown */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>HVAC Usage</InputLabel>
              <Select name="HVACUsage" value={manualInput.HVACUsage} onChange={handleInputChange}>
                <MenuItem value="On">On</MenuItem>
                <MenuItem value="Off">Off</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Lighting Usage Dropdown */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Lighting Usage</InputLabel>
              <Select name="LightingUsage" value={manualInput.LightingUsage} onChange={handleInputChange}>
                <MenuItem value="On">On</MenuItem>
                <MenuItem value="Off">Off</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Renewable Energy Slider */}
          <Grid item xs={12}>
            <Typography>Renewable Energy Contribution (%): {manualInput.RenewableEnergy}</Typography>
            <GreenSlider
              value={manualInput.RenewableEnergy}
              min={0}
              max={100}
              step={1}
              onChange={handleSliderChange("RenewableEnergy")}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Day of the Week Dropdown */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Day of the Week</InputLabel>
              <Select name="DayOfWeek" value={manualInput.DayOfWeek} onChange={handleInputChange}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Holiday Dropdown */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Holiday</InputLabel>
              <Select name="Holiday" value={manualInput.Holiday} onChange={handleInputChange}>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Predict Button */}
        <GreenButton variant="contained" onClick={handlePredict} sx={{ mt: 3 }}>
          Predict
        </GreenButton>
      </GreenPastelPaper>

      {/* Error Message */}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {/* Prediction Results */}
      {prediction && (
        <GreenPastelPaper elevation={3}>
          <Typography variant="h5" sx={{ marginBottom: 2, color: "#2e7d32" }}>
            Prediction Results
          </Typography>
          {prediction.map((pred, index) => (
            <Typography key={index} sx={{ fontSize: "1.1rem" }}>
              <strong>Predicted Consumption:</strong> {pred.predicted_consumption.toFixed(2)} kWh
            </Typography>
          ))}
        </GreenPastelPaper>
      )}
    </Box>
  );
};

export default Prediction;
