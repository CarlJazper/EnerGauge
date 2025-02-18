import React, { useState, useEffect } from "react";
import { Typography, Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import Loader from "./layouts/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          margin: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" sx={{ mb: 1, fontSize: "100px", color: "#2E7D32" }}>
            EnerGauge
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ mb: 4, pl: "5rem", fontSize: "1.5rem" }}
          >
            Energy Consumption and Demand Forecasting
          </Typography>
        </motion.div>

        {/* Mission and Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Typography variant="h4" sx={{ mt: 4, fontWeight: "bold", color: "#2E7D32" }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, maxWidth: "80%", color: "#555" }}>
            To empower individuals and businesses with data-driven insights for efficient energy consumption and sustainable resource management.
          </Typography>

          <Typography variant="h4" sx={{ mt: 3, fontWeight: "bold", color: "#2E7D32" }}>
            Our Vision
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "80%", color: "#555" }}>
            A world where energy efficiency is maximized, waste is minimized, and sustainability is at the core of decision-making.
          </Typography>
        </motion.div>
      </Box>

      {/* Right Green Bar with Image Overlay */}
      <Box
        sx={{
          width: "30%",
          backgroundColor: "#A0C878",
          position: "relative", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20px",
          margin: "2rem",
        }}
      >
        <Box
          component="img"
          src="../images/home.png" // Replace with your image path
          alt="Energy Illustration"
          sx={{
            width: "80%",
            maxHeight: "80%",
            borderRadius: "15px",
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
