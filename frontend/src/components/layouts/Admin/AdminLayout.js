import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.7s",
          marginLeft: sidebarOpen ? "20px" : "10px",
          padding: 2,
        }}
      >
        <Outlet /> {/* This will render the correct page inside the layout */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
