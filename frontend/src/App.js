import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./components/Home";
import Header from "./components/layouts/Header";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import TrainModel from './components/Admin/TrainModel';
import Prediction from './components/Prediction/Prediction';
import ProtectedRoute from "./components/utils/protectedRoute";
import AdminDashboard from './components/Admin/Dashboard';
import Profile from "./components/User/Profile";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/train"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TrainModel/>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
          />

      </Routes>
    </Router>
  );
}

export default App;
