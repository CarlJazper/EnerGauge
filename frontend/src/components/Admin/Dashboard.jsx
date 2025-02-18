import React, { useState } from "react";
import { Typography, Box, IconButton, Menu, MenuItem, Avatar, Tooltip, Divider, Container } from "@mui/material";
import Forecast from "./Forecast/ForecastData";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Handle dropdown menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Container sx={{ flexGrow: 1, pt: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        {/* Dashboard Title */}
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Dashboard
        </Typography>

        {/* Profile Management */}
        <Box>
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40 }}>A</Avatar>
            </IconButton>
          </Tooltip>

          {/* Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/profile")}>Update Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main Dashboard Content */}
      <Forecast />
    </Container>
  );
};

export default Dashboard;
