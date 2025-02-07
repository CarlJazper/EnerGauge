import React, { useState } from "react";
import axios from "axios";

const TrainModel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [metrics, setMetrics] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/train", formData);
      setMessage(response.data.message);
      setMetrics(response.data.metrics);
    } catch (error) {
      setMessage("Error training model.");
    }
  };

  return (
    <div>
      <h2>Train Model</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Train</button>
      <p>{message}</p>
      {metrics && (
        <div>
          <h3>Model Metrics</h3>
          <p>R² Score: {metrics["R2 Score"]}</p>
          <p>MAE: {metrics["MAE"]}</p>
          <p>RMSE: {metrics["RMSE"]}</p>
        </div>
      )}
    </div>
  );
};

export default TrainModel;
