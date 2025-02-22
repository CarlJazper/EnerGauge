import React, { useEffect, useState } from "react";
import axios from "axios";
import {IconButton,Snackbar,Alert,Dialog,DialogActions,DialogContent,DialogTitle,Button,Typography,Paper,Box,Chip,ThemeProvider,createTheme,} from "@mui/material";
import { Edit, Delete, Refresh, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

// Custom theme with green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784', // pastel green
      light: '#b2fab4',
      dark: '#519657',
    },
    secondary: {
      main: '#a5d6a7', // lighter pastel green
    },
    background: {
      default: '#e8f5e9', // very light pastel green
      paper: '#ffffff',
    },
    error: {
      main: '#ef9a9a', // pastel red
    },
  },
});

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/users/userslist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
        setSnackbarMessage("Failed to fetch users. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (id) => {
    navigate(`/admin/update_user/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/users/delete/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setUsers(users.filter((user) => user._id !== selectedUserId));
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        setSnackbarMessage("Failed to delete user. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setOpenDialog(false);
      });
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  const columns = [
    {
      name: "User",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
      cell: (row) => (
        <Box display="flex" alignItems="center">
          <Person sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="body2">
            {row.first_name} {row.last_name}
          </Typography>
        </Box>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <Typography variant="body2">{row.email}</Typography>,
    },
    {
      name: "Location",
      selector: (row) => `${row.city}, ${row.country}`,
      sortable: true,
      cell: (row) => (
        <Chip 
          label={`${row.city}, ${row.country}`} 
          size="small" 
          sx={{ 
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.dark,
          }} 
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEditClick(row._id)} size="small">
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(row._id)} size="small">
            <Delete />
          </IconButton>
        </Box>
      ),
      width: "120px",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              User Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={fetchUsers}
            >
              Refresh
            </Button>
          </Box>

          <DataTable
            columns={columns}
            data={users}
            pagination
            progressPending={loading}
            highlightOnHover
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  fontWeight: 'bold',
                },
              },
              rows: {
                style: {
                  fontSize: '14px',
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.background.default,
                  },
                },
              },
            }}
          />

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} variant="filled">
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Dialog open={openDialog} onClose={cancelDelete}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default UserList;
