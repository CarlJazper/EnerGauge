import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Tooltip, Typography } from "@mui/material";
import { People, Bolt, Timeline, Menu, Dashboard, History } from "@mui/icons-material";
import { Link } from "react-router-dom";

const AdminSidebar = ({ open, setOpen }) => {
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/admin/dashboard" },
    { text: "User List", icon: <People />, link: "/admin/users" },
    { text: "Train Energy Model", icon: <Bolt />, link: "/admin/train" },
    { text: "Train Forecast Model", icon: <Timeline />, link: "/admin/train_arima" },
    { text: "Recent Forecast", icon: <History />, link: "/admin/recent_forecast" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 60,
          transition: "width 0.7s",
          overflowX: "hidden",
          position: "fixed",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#383560",
          color: "white",
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 1.5,
          px: open ? 2 : 1,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {open && <img src="/images/logo-admin.png" alt="Logo" style={{ height: 35 }} />}
        <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
          <Menu />
        </IconButton>
      </Box>

      {/* Sidebar Items */}
      <List>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={!open ? item.text : ""} placement="right">
            <ListItem
              button
              component={Link}
              to={item.link}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                padding: open ? "12px 20px" : "12px",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>{item.icon}</ListItemIcon>
              {open && (
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                      {item.text}
                    </Typography>
                  }
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
