import React, { useState } from "react";
import { Typography, Box, IconButton, Menu, MenuItem, Avatar, Tooltip, Divider, Container, Paper, Grid } from "@mui/material";
import Forecast from "./Forecast/ForecastData";
import { useNavigate } from "react-router-dom";
import { Dashboard as DashboardIcon, Person, ExitToApp } from "@mui/icons-material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

// Custom theme with green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784', // pastel green
      light: '#b2fab4',
      dark: '#519657',
    },
    secondary: {
      main: '#a5d6a7', // lighter pastel green
    },
    background: {
      default: '#e8f5e9', // very light pastel green
      paper: '#ffffff',
    },
    text: {
      primary: '#2e7d32', // dark green
      secondary: '#4caf50', // medium green
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
  backgroundColor: theme.palette.background.paper,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  transition: 'all 0.3s ease-in-out',
}));

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
              <StyledPaper elevation={0}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* Dashboard Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.dark" }}>
                      Dashboard
                    </Typography>
                  </Box>

                  {/* Profile Management */}
                  <Box>
                    <Tooltip title="Account">
                      <StyledIconButton onClick={handleMenuOpen}>
                        <Avatar sx={{ bgcolor: "transparent", color: 'inherit' }}>A</Avatar>
                      </StyledIconButton>
                    </Tooltip>

                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => navigate("/profile")}>
                        <Person sx={{ mr: 2, color: 'primary.main' }} /> Update Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ExitToApp sx={{ mr: 2, color: 'primary.main' }} /> Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>

            {/* Main Dashboard Content */}
            <Grid item xs={12}>
              <StyledPaper elevation={0}>
                <Forecast />
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
