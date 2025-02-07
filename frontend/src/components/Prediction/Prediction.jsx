import React, { useState } from "react";
import axios from "axios";

const Prediction = () => {
  const [file, setFile] = useState(null);
  const [manualInput, setManualInput] = useState({
    month: "",
    weekday: "",
    temperature: "",
    is_holiday: "",
    day_of_year: ""
  });
  const [predictions, setPredictions] = useState([]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }, 
      });
  
      console.log("Predictions data:", response.data);
      setPredictions(response.data);
    } catch (error) {
      console.error("Error making predictions:", error.response ? error.response.data : error);
      alert("Error making predictions. Check the console for details.");
    }
  };

  
  // Handle Manual Input
  const handleManualPredict = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict", manualInput, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Manual Prediction:", response.data);
      
      // Check the structure of the response to make sure it's an array
      if (Array.isArray(response.data)) {
        setPredictions(response.data); // Use the response directly if it's an array
      } else {
        alert("Unexpected response format.");
      }
    } catch (error) {
      alert("Error making predictions.");
    }
  };
  

  return (
    <div>
      <h2>Predict Energy Consumption</h2>

      {/* CSV Upload Section */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Predict from CSV</button>

      <hr />

      {/* Manual Input Section */}
      <h3>Or Enter Data Manually</h3>
      <input
        type="number"
        placeholder="Month"
        value={manualInput.month}
        onChange={(e) => setManualInput({ ...manualInput, month: e.target.value })}
      />
      <input
        type="number"
        placeholder="Weekday"
        value={manualInput.weekday}
        onChange={(e) => setManualInput({ ...manualInput, weekday: e.target.value })}
      />
      <input
        type="number"
        placeholder="Temperature"
        value={manualInput.temperature}
        onChange={(e) => setManualInput({ ...manualInput, temperature: e.target.value })}
      />
      <input
        type="number"
        placeholder="Is Holiday (1 for Yes, 0 for No)"
        value={manualInput.is_holiday}
        onChange={(e) => setManualInput({ ...manualInput, is_holiday: e.target.value })}
      />
      <input
        type="number"
        placeholder="Day of Year"
        value={manualInput.day_of_year}
        onChange={(e) => setManualInput({ ...manualInput, day_of_year: e.target.value })}
      />
      <button onClick={handleManualPredict}>Predict from Manual Input</button>

      {/* Predictions Display */}
      <ul>
  {predictions.map((item, index) => (
    <li key={index}>
      Date: {Number(item.day_of_year)}, Predicted Consumption: {Number(item.predicted_consumption).toFixed(2)}
    </li>
  ))}
</ul>


    </div>
  );
};

export default Prediction;
