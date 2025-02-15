import React from "react";
import { Typography, Box, Container } from "@mui/material";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "#2E7D32" }}>
          About Us
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Typography variant="body1" sx={{ mt: 3, maxWidth: "800px", color: "#555" }}>
          At EnerGauge, we are committed to providing data-driven insights to help businesses and individuals optimize energy consumption and drive sustainability. Our advanced forecasting technology ensures efficient energy use, reducing waste and promoting eco-friendly solutions.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Typography variant="h4" sx={{ mt: 5, fontWeight: "bold", color: "#2E7D32" }}>
          Our Values
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: "800px", color: "#555" }}>
          - Sustainability: Promoting responsible energy consumption.
          <br />- Innovation: Using technology to drive efficiency.
          <br />- Accuracy: Providing reliable energy forecasts.
          <br />- Customer Focus: Tailoring solutions to user needs.
        </Typography>
      </motion.div>
    </Container>
  );
};

export default AboutUs;
