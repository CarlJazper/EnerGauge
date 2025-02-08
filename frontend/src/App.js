import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Header from "./components/layouts/Header";
import Prediction from './components/Prediction/Prediction';
import ProtectedRoute from "./components/utils/protectedRoute";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
