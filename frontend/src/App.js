import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Header from "./components/layouts/Header";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem('token') ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
