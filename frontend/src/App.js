import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/layouts/Header";
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

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route 
        path="admin/train_arima" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
              <TrainForecast/>  
          </ProtectedRoute>
        }/>

        <Route
          path="admin/train"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TrainModel/>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
