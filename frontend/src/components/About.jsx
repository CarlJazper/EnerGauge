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
        py: 8,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "#2E7D32", mb: 2 }}>
          About Us
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Typography variant="body1" sx={{ mt: 2, maxWidth: "800px", color: "#555", lineHeight: 1.6 }}>
          At EnerGauge, we are committed to providing data-driven insights to help businesses and individuals optimize energy consumption and drive sustainability. Our advanced forecasting technology ensures efficient energy use, reducing waste and promoting eco-friendly solutions.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ width: "100%" }}
      >
        <Typography variant="h4" sx={{ mt: 6, fontWeight: "bold", color: "#2E7D32" }}>
          Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          {[
            { name: "John Doe", role: "Co-Founder & CEO", img: "/images/logo.png" },
            { name: "Jane Smith", role: "Co-Founder & CTO", img: "/images/logo.png" },
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.8 }}
              >
                <Box
                  component="img"
                  src={member.img}
                  alt={member.name}
                  sx={{
                    width: "100%",
                    maxWidth: "180px",
                    borderRadius: "50%",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#2E7D32" }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {member.role}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AboutUs;
