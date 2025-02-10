import { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

const Prediction = () => {
  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState({
    Temperature: "",
    Humidity: "",
    SquareFootage: "",
    Occupancy: "",
    HVACUsage: "",
    LightingUsage: "",
    RenewableEnergy: "",
    DayOfWeek: "",
    Holiday: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setManualInput({ ...manualInput, [e.target.name]: e.target.value });
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
      <h2>Make a Prediction</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handlePredict} style={{ marginLeft: "10px" }}>
        Predict from File
      </Button>

      <h3>Or Enter Data Manually</h3>
      {Object.keys(manualInput).map((key) => (
        <TextField
          key={key}
          label={key}
          name={key}
          value={manualInput[key]}
          onChange={handleInputChange}
          margin="dense"
          variant="outlined"
          fullWidth
        />
      ))}
      <Button variant="contained" color="primary" onClick={handlePredict} style={{ marginTop: "10px" }}>
        Predict
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {prediction && (
        <div>
          <h3>Prediction Results</h3>
          {prediction.map((pred, index) => (
            <p key={index}>
              <strong>Predicted Consumption:</strong> {pred.predicted_consumption.toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prediction;
