import React, { useState } from "react";
import { Typography, Box, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
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
    <Box sx={{ flexGrow: 1, padding: 2, position: "relative" }}>
      {/* Profile Management (Top Right) */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleMenuOpen}>
          <Avatar sx={{ bgcolor: "secondary.main" }}>A</Avatar>
        </IconButton>

        {/* Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => navigate("/profile")}>Update Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Dashboard Title */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      {/* Main Dashboard Content */}
      <Forecast />
    </Box>
  );
};

export default Dashboard;
