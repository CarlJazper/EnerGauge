import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
//Guest
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
//User
import UserDashboard from "./components/User/Dashboard";
import Header from "./components/layouts/User/Header";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import Forecast from "./components/Forecast/Forecast";
//Admin
import AdminDashboard from "./components/Admin/Dashboard";
import AdminLayout from "./components/layouts/Admin/AdminLayout";
import TrainForecast from "./components/Admin/Training/TrainForecast";
import RecentForecast from "./components/Admin/Forecast/RecentForecast";
import UserList from "./components/Admin/User/UserList";
import UserUpdate from "./components/Admin/User/UserUpdate";
//Utils
import ProtectedRoute from "./components/utils/protectedRoute";

// 🌟 Define Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color
    },
    secondary: {
      main: "#f50057", // Customize secondary color
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Custom font
    button: {
      textTransform: "none", // Disable uppercase text on buttons
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/update"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecast"
            element={
              <ProtectedRoute>
                <Forecast />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="update_user/:id" element={<UserUpdate />} />
            <Route path="train_arima" element={<TrainForecast />} />
            <Route path="recent_forecast" element={<RecentForecast />} />
          </Route>
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
