import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    country: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setMessage(error.response?.data.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data.message || "Update failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>Profile</Typography>
        
        <TextField label="First Name" name="first_name" fullWidth value={user.first_name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Last Name" name="last_name" fullWidth value={user.last_name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Address" name="address" fullWidth value={user.address} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="City" name="city" fullWidth value={user.city} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField label="Country" name="country" fullWidth value={user.country} onChange={handleChange} sx={{ mb: 2 }} />

        <Button variant="contained" fullWidth onClick={handleUpdate} sx={{ mt: 2 }}>Update Profile</Button>

        {message && <Typography variant="body2" color="success" sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default Profile;
