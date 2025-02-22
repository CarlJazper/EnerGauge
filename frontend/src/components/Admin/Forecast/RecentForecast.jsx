import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Box, Chip, Avatar } from "@mui/material";
import axios from "axios";
import Loader from "../../layouts/Loader";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { BoltOutlined, CalendarToday, Person, TrendingUp, EmojiEvents } from "@mui/icons-material";

// Custom theme with green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784',
      light: '#b2fab4',
      dark: '#519657',
    },
    secondary: {
      main: '#a5d6a7',
    },
    background: {
      default: '#e8f5e9',
      paper: '#ffffff',
    },
    text: {
      primary: '#2e7d32',
      secondary: '#4caf50',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& > svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    transform: 'translateY(-2px)',
  },
}));

const FadeInBox = styled(Box)(({ theme }) => ({
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
}));

const BoldSpan = styled('span')({
  fontWeight: 'bold',
});

const RecentForecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/trends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setForecasts(response.data.forecasts);
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      })
      .catch((error) => {
        console.error("Error fetching forecast data", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container>
          <FadeInBox sx={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: 'primary.dark' }}>
              Recent Forecasts
            </Typography>
          </FadeInBox>
          <Grid container spacing={3}>
            {forecasts.length > 0 ? (
              forecasts.map((f, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FadeInBox 
                    sx={{ 
                      opacity: animate ? 1 : 0, 
                      transform: animate ? 'translateY(0)' : 'translateY(20px)',
                      transitionDelay: `${index * 0.1}s`
                    }}
                  >
                    <StyledCard>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <AnimatedAvatar>
                            {f.first_name ? f.first_name[0] : 'U'}
                          </AnimatedAvatar>
                          <AnimatedChip 
                            label={f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "Unknown Date"} 
                            icon={<CalendarToday />}
                          />
                        </Box>
                        <IconWrapper>
                          <Person />
                          <Typography variant="subtitle1">
                            <BoldSpan>Name:</BoldSpan> {f.first_name ? `${f.first_name} ${f.last_name}` : "Unknown User"}
                          </Typography>
                        </IconWrapper>
                        <IconWrapper>
                          <BoltOutlined />
                          <Typography variant="body1">
                            <BoldSpan>Energy Consumption:</BoldSpan> {f.total_forecast_energy.toFixed(2)} kWh
                          </Typography>
                        </IconWrapper>
                        <IconWrapper>
                          <TrendingUp />
                          <Typography variant="body1">
                            <BoldSpan>Energy Savings:</BoldSpan> {f.total_energy_savings.toFixed(2)} kWh
                          </Typography>
                        </IconWrapper>
                        <IconWrapper>
                          <EmojiEvents />
                          <Typography variant="body1">
                            <BoldSpan>Peak Load:</BoldSpan> {f.peak_load ? `${f.peak_load} kW` : "No Data"}
                          </Typography>
                        </IconWrapper>
                      </CardContent>
                    </StyledCard>
                  </FadeInBox>
                </Grid>
              ))
            ) : (
              <FadeInBox sx={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)' }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mt: 2 }}>
                  No forecast data available.
                </Typography>
              </FadeInBox>
            )}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RecentForecast;
