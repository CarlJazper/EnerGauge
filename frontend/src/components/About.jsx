import React from "react";
import { Typography, Box, Container, Grid } from "@mui/material";
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
          Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="Person 1"
              sx={{ width: "100%", maxWidth: "200px", borderRadius: "50%" }}
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#2E7D32" }}>
              Person 1
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Co-Founder & CEO
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="Person 2"
              sx={{ width: "100%", maxWidth: "200px", borderRadius: "50%" }}
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#2E7D32" }}>
              Person 2
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Co-Founder & CTO
            </Typography>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AboutUs;
