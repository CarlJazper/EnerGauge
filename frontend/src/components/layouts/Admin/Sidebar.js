import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Tooltip, Typography, ThemeProvider, createTheme } from "@mui/material";
import { People, Timeline, Menu, Dashboard, History } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { styled, keyframes } from "@mui/system";

// Custom theme with green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784',
      light: '#b2fab4',
      dark: '#519657',
    },
    background: {
      default: '#e8f5e9',
      paper: '#f1f8e9',
    },
    text: {
      primary: '#2e7d32',
      secondary: '#4caf50',
    },
  },
});

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled components
const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? 240 : 70,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    width: open ? 240 : 70,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    position: "fixed",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.dark : theme.palette.text.primary,
  backgroundColor: isActive ? theme.palette.primary.light : 'transparent',
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    transform: 'translateX(5px)',
    transition: 'transform 0.3s ease-in-out',
  },
  borderRadius: '0 20px 20px 0',
  margin: '8px 0',
  padding: '12px 20px',
  transition: 'all 0.3s ease-in-out',
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, isActive }) => ({
  color: isActive ? theme.palette.primary.dark : theme.palette.text.secondary,
  minWidth: '40px',
  transition: 'color 0.3s ease-in-out',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  opacity: 0,
  animation: `${slideIn} 0.5s ease-in-out forwards`,
  animationDelay: '0.2s',
}));

const AdminSidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/admin/dashboard" },
    { text: "User List", icon: <People />, link: "/admin/users" },
    { text: "Train Forecast Model", icon: <Timeline />, link: "/admin/train_arima" },
    { text: "Recent Forecast", icon: <History />, link: "/admin/recent_forecast" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <StyledDrawer variant="permanent" open={open}>
        {/* Sidebar Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
            borderBottom: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          {open && (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.dark,
                opacity: 0,
                animation: `${fadeIn} 0.5s ease-in-out forwards`,
                animationDelay: '0.3s',
              }}
            >
              EnerGauge Admin
            </Typography>
          )}
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              color: theme.palette.primary.main,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(180deg)',
              },
            }}
          >
            <Menu />
          </IconButton>
        </Box>

        {/* Sidebar Items */}
        <List sx={{ pt: 2 }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <Tooltip key={index} title={!open ? item.text : ""} placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={item.link}
                  isActive={isActive}
                  sx={{ 
                    animationDelay: `${index * 0.1}s`,
                    padding: open ? '12px 20px' : '12px',
                  }}
                >
                  <StyledListItemIcon isActive={isActive}>
                    {item.icon}
                  </StyledListItemIcon>
                  {open && (
                    <StyledListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                          {item.text}
                        </Typography>
                      }
                    />
                  )}
                </StyledListItem>
              </Tooltip>
            );
          })}
        </List>
      </StyledDrawer>
    </ThemeProvider>
  );
};

export default AdminSidebar;
