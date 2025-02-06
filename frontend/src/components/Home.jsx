import React from "react";
import TrainModel from "./TrainModel";
import Prediction from "./Prediction";

const Home = () => {
  return (
    <div>
      <h1>Energy Consumption Forecasting</h1>
      <TrainModel />
      <Prediction />
    </div>
  );
};

export default Home;
