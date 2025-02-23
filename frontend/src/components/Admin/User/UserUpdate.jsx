import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserUpdate = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data to update
    axios
      .get(`http://localhost:5000/api/users/usersdata/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:5000/api/users/update/${id}`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        navigate("/admin/users");
      })
      .catch((error) => {
        console.error("Error updating user", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: "auto" }}>
      <h2>Update User</h2>
      <TextField
        fullWidth
        label="First Name"
        name="first_name"
        value={user.first_name || ""}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Last Name"
        name="last_name"
        value={user.last_name || ""}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={user.email || ""}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={user.phone || ""}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={user.address || ""}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="City"
        name="city"
        value={user.city || ""}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Country"
        name="country"
        value={user.country || ""}
        onChange={handleInputChange}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
        {loading ? "Loading..." : "Update"}
      </Button>
    </Box>
  );
};

export default UserUpdate;
