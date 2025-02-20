import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Home from "./components/Home";
import Header from "./components/layouts/User/Header";
import Login from "./components/User/Login";
import Register from "./components/User/Register";

import TrainModel from "./components/Admin/Training/TrainModel";
import TrainForecast from "./components/Admin/Training/TrainForecast";

import Prediction from "./components/Prediction/Prediction";
import ProtectedRoute from "./components/utils/protectedRoute";
import AdminDashboard from "./components/Admin/Dashboard";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";

import Forecast from "./components/Forecast/Forecast";
import UserDashboard from "./components/User/Dashboard";
import About from "./components/About";

import AdminLayout from "./components/layouts/Admin/AdminLayout";
import RecentForecast from "./components/Admin/Forecast/RecentForecast";
import UserList from "./components/Admin/User/UserList";
import UserUpdate from "./components/Admin/User/UserUpdate";

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
          <Route
            path="/prediction"
            element={
              <ProtectedRoute>
                <Prediction />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="update_user/:id" element={<UserUpdate />} />
            <Route path="train_arima" element={<TrainForecast />} />
            <Route path="train" element={<TrainModel />} />
            <Route path="recent_forecast" element={<RecentForecast />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
