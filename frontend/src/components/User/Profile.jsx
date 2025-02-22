import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, Paper, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: "#e8f5e9",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  backgroundColor: "#81c784",
  fontSize: "2rem",
}));

const ProfileField = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  backgroundColor: "#c8e6c9",
  color: "#1b5e20",
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: "#66bb6a",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#4caf50",
  },
}));

const MotionContainer = styled(motion.div)({
  width: "100%",
});

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
      <MotionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfilePaper elevation={3}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <ProfileAvatar>{user.first_name[0] + user.last_name[0]}</ProfileAvatar>
            <Typography variant="h4" align="center" sx={{ mb: 3, color: "#2e7d32" }}>
              {user.first_name} {user.last_name}
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileField><strong>Address:</strong> {user.address}</ProfileField>
            </Grid>
            <Grid item xs={6}>
              <ProfileField><strong>City:</strong> {user.city}</ProfileField>
            </Grid>
            <Grid item xs={6}>
              <ProfileField><strong>Country:</strong> {user.country}</ProfileField>
            </Grid>
          </Grid>

          <UpdateButton 
            variant="contained" 
            fullWidth 
            onClick={() => navigate("/profile/update")}
          >
            Update Profile
          </UpdateButton>

          {message && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: "center" }}>
              {message}
            </Typography>
          )}
        </ProfilePaper>
      </MotionContainer>
    </Container>
  );
};

export default Profile;
