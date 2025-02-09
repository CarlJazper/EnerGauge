import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>Profile</Typography>
        
        <Typography><strong>First Name:</strong> {user.first_name}</Typography>
        <Typography><strong>Last Name:</strong> {user.last_name}</Typography>
        <Typography><strong>Address:</strong> {user.address}</Typography>
        <Typography><strong>City:</strong> {user.city}</Typography>
        <Typography><strong>Country:</strong> {user.country}</Typography>

        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 3 }} 
          onClick={() => navigate("/profile/update")}
        >
          Update Profile
        </Button>

        {message && <Typography variant="body2" color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default Profile;
