import { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const TrainModel = () => {
  const [file, setFile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTrain = async () => {
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // Get JWT token

      const response = await axios.post("http://localhost:5000/train_rfr", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include JWT token
        },
      });

      setMetrics(response.data.metrics);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while training.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Train Model</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleTrain} style={{ marginLeft: "10px" }}>
        Train Model
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {metrics && (
        <div>
          <h3>Training Metrics</h3>
          <p><strong>R2 Score:</strong> {metrics["R2 Score"].toFixed(4)}</p>
          <p><strong>MAE:</strong> {metrics["MAE"].toFixed(4)}</p>
          <p><strong>RMSE:</strong> {metrics["RMSE"].toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default TrainModel;
