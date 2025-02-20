import React from "react";
import { Typography, Box, Container, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";

const AboutUs = () => {
  const teamMembers = [
    { name: "Carl Jazper C. Perez ", role: "Bsit Student", img: "/images/logo.png" },
    { name: "Marc Gerald T. Salonga", role: "Bsit Student", img: "/images/logo.png" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, color: "#7CB342", mb: 4, textAlign: "center" }}>
          About EnerGauge
        </Typography>
      </motion.div>

      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography variant="body1" sx={{ color: "#4A4A4A", lineHeight: 1.8, fontSize: "1.1rem" }}>
            At EnerGauge, we revolutionize energy management through demand forecasting and consumption prediction. Our advanced models analyze trends, environmental factors, and usage patterns to provide accurate energy forecasts.
            </Typography>
            <Typography variant="body1" sx={{ color: "#4A4A4A", lineHeight: 1.8, fontSize: "1.1rem", mt: 2 }}>
            By predicting demand and optimizing efficiency, we help businesses and individuals reduce waste, lower costs, and promote sustainability.
            </Typography>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Box
              component="img"
              src="/images/energy-management.png"
              alt="Energy Management"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              }}
            />
          </motion.div>
        </Grid>
      </Grid>

      <Typography variant="h3" sx={{ fontWeight: 700, color: "#7CB342", mt: 10, mb: 6, textAlign: "center" }}>
        Our Team
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  textAlign: "center", 
                  borderRadius: 4, 
                  height: "100%",
                  backgroundColor: "#F1F8E9",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={member.img}
                  alt={member.name}
                  sx={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    mb: 2,
                    border: "4px solid #AED581",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#558B2F" }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#689F38", mt: 1 }}>
                  {member.role}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutUs;
