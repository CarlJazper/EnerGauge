import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconButton, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false); // For confirmation dialog
  const [selectedUserId, setSelectedUserId] = useState(null); // To store the user id for deletion
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users
    axios
      .get("http://localhost:5000/api/users/userslist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
        },
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (id) => {
    navigate(`/admin/update_user/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id); // Set the selected user ID for deletion
    setOpenDialog(true); // Open the confirmation dialog
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/users/delete/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        // Refresh user list
        setUsers(users.filter((user) => user._id !== selectedUserId));
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false); // Close dialog after deletion
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        setSnackbarMessage("Failed to delete user. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setOpenDialog(false); // Close dialog on error
      });
  };

  const cancelDelete = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <IconButton color="primary" onClick={() => handleEditClick(row._id)}>
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(row._id)}
            style={{ marginLeft: 10 }}
          >
            <Delete />
          </IconButton>
        </>
      ),
      width: "200px",
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={users}
        pagination
        progressPending={loading}
        highlightOnHover
        responsive
        striped
      />

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
