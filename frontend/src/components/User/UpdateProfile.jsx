import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Container, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const UpdateProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: "#e8f5e9",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#81c784",
    },
    "&:hover fieldset": {
      borderColor: "#66bb6a",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#4caf50",
    },
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: "#66bb6a",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#4caf50",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderColor: "#66bb6a",
  color: "#2e7d32",
  "&:hover": {
    borderColor: "#4caf50",
    backgroundColor: "rgba(76, 175, 80, 0.04)",
  },
}));

const MotionContainer = styled(motion.div)({
  width: "100%",
});

const UpdateProfile = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/profile/update", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <MotionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UpdateProfilePaper elevation={3}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: "#2e7d32" }}>
            Update Profile
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField label="First Name" name="first_name" fullWidth value={user.first_name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField label="Last Name" name="last_name" fullWidth value={user.last_name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField label="Phone" name="phone" fullWidth value={user.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField label="Address" name="address" fullWidth value={user.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField label="City" name="city" fullWidth value={user.city} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField label="Country" name="country" fullWidth value={user.country} onChange={handleChange} />
            </Grid>
          </Grid>

          <SaveButton variant="contained" fullWidth onClick={handleUpdate}>
            Save Changes
          </SaveButton>
          <CancelButton variant="outlined" fullWidth onClick={() => navigate("/profile")}>
            Cancel
          </CancelButton>

          {message && (
            <Typography 
              variant="body2" 
              color={message.includes("successfully") ? "success" : "error"} 
              sx={{ mt: 2, textAlign: "center" }}
            >
              {message}
            </Typography>
          )}
        </UpdateProfilePaper>
      </MotionContainer>
    </Container>
  );
};

export default UpdateProfile;
