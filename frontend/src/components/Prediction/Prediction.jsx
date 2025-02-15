import { useState } from "react";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Slider, Typography, Grid } from "@mui/material";
import axios from "axios";

const Prediction = () => {
  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState({
    Temperature: 0, // Default reasonable values
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
      const token = localStorage.getItem("token"); // Get JWT token
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
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Energy Consumption Prediction</Typography>

      {/* File Upload */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handlePredict} sx={{ ml: 2 }}>
        Predict from File
      </Button>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Or Enter Data Manually
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Temperature Slider */}
        <Grid item xs={12}>
          <Typography>Temperature (°C): {manualInput.Temperature}</Typography>
          <Slider
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
          <Slider
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
          <Slider
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
      <Button variant="contained" color="primary" onClick={handlePredict} sx={{ mt: 2 }}>
        Predict
      </Button>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Prediction Results */}
      {prediction && (
        <div>
          <Typography variant="h5" sx={{ mt: 3 }}>
            Prediction Results
          </Typography>
          {prediction.map((pred, index) => (
            <Typography key={index}>
              <strong>Predicted Consumption:</strong> {pred.predicted_consumption.toFixed(2)} kWh
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prediction;
