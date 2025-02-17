import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/layouts/User/Header";
import Login from "./components/User/Login";
import Register from "./components/User/Register";

import TrainModel from './components/Admin/Training/TrainModel';
import TrainForecast from "./components/Admin/Training/TrainForecast";

import Prediction from './components/Prediction/Prediction';
import ProtectedRoute from "./components/utils/protectedRoute";
import AdminDashboard from './components/Admin/Dashboard';
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";

import Forecast from "./components/Forecast/Forecast";
import UserDashboard from "./components/User/Dashboard";
import About from "./components/About";

import AdminLayout from "./components/layouts/Admin/AdminLayout"; // New Layout
import RecentForecast from "./components/Admin/Forecast/RecentForecast";
import UserList from "./components/Admin/User/UserList";
import UserUpdate from "./components/Admin/User/UserUpdate";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
         } 
        />

        <Route 
        path="/profile/update" 
        element={
            <ProtectedRoute>
              <UpdateProfile/>
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
            <Forecast/>
          </ProtectedRoute>
        }/>

        <Route 
        path="/prediction" 
        element={
          <ProtectedRoute>
            <Prediction/>
          </ProtectedRoute>
        }/>

{/* Admin Routes */}
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
  );
}

export default App;