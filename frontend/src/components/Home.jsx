import React, { useState, useEffect } from "react";
import { Typography, Box, Container, Button, Grid, Paper, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
// import Loader from "./layouts/Loader";
import { styled } from "@mui/system";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import InsightsIcon from '@mui/icons-material/Insights';
import SavingsIcon from '@mui/icons-material/Savings';
import { useNavigate } from "react-router-dom";  // Import useNavigate

// Pastel green palette
const pastelGreen = {
  light: '#E8F5E9',
  main: '#81C784',
  dark: '#4CAF50',
};

const GradientText = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #81C784, #4CAF50)", // Ensure this works properly
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 900,
  letterSpacing: "-0.05em",
  lineHeight: 1.2,
  marginBottom: theme.spacing(2),
}));

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  transition: 'all 0.3s ease',
  borderRadius: theme.spacing(2),
  backgroundColor: pastelGreen.light,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const AnimatedBox = styled(motion.div)`
  width: 100%;
`;

const Home = () => {
  // const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // Initialize useNavigate

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <Container maxWidth="xl" sx={{ minHeight: "100vh", py: { xs: 4, md: 12 } }}>
      <Grid container spacing={8} alignItems="center">
        <Grid item xs={12} md={7}>
          <AnimatedBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            sx={{ pl: { md: 4, lg: 8 } }}
          >
            <GradientText variant="h1" sx={{ fontSize: { xs: "3.5rem", md: "4.5rem", lg: "7.5rem" } }}>
              EnerGauge
            </GradientText>
            <Typography variant="h4" color="textSecondary" sx={{ mb: 3, fontSize: { xs: "1.5rem", md: "1.5rem" }, fontWeight: 200 }}>
              Revolutionizing Energy Management
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", fontSize: "1rem", maxWidth: "600px" }}>
              EnerGauge provides cutting-edge forecasting and insights for smarter energy decisions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 3,
                fontSize: "1rem",
                borderRadius: "50px",
                backgroundColor: pastelGreen.main,
                '&:hover': {
                  backgroundColor: pastelGreen.dark,
                },
              }}
              onClick={() => navigate("/login")} // Navigate to /login when clicked
            >
              Get Started
            </Button>
          </AnimatedBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatedBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="/images/home.png"
              alt="Energy Management Illustration"
              sx={{
                width: '200px',
                maxWidth: '450px',
                height: 'auto',
                borderRadius: theme.spacing(4),
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            />
          </AnimatedBox>
        </Grid>
      </Grid>

      <Box sx={{ mt: { xs: 8, md: 16 }, mb: 8 }}>
        <Typography variant="h2" sx={{ mb: 8, textAlign: "center", fontWeight: 700, color: pastelGreen.dark }}>
          Empower Your Energy Decisions
        </Typography>
        <Grid container spacing={4}>
          {[ 
            { icon: <BoltIcon sx={{ fontSize: 40, color: pastelGreen.main }} />, title: "Energy Consumption", description: "Predict Energy consumption with advance model algorithms" },
            { icon: <InsightsIcon sx={{ fontSize: 40, color: pastelGreen.main }} />, title: "Predictive Analytics", description: "Leverage advanced Model algorithms to forecast future energy demands." },
            { icon: <SavingsIcon sx={{ fontSize: 40, color: pastelGreen.main }} />, title: "Cost Savings", description: "Identify Energy Saving, reduce energy waste, with data-driven insights." },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <AnimatedBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <FeatureBox elevation={0}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h5" sx={{ ml: 2, fontWeight: 600, color: pastelGreen.dark }}>{feature.title}</Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">{feature.description}</Typography>
                </FeatureBox>
              </AnimatedBox>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 16 }, textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700, color: pastelGreen.dark }}>
          Ready to Transform Your Energy Management?
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            fontSize: "1rem",
            borderRadius: "50px",
            borderWidth: 2,
            borderColor: pastelGreen.main,
            color: pastelGreen.dark,
            '&:hover': {
              borderColor: pastelGreen.dark,
              backgroundColor: pastelGreen.light,
            },
          }}
        >
          Learn More
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
