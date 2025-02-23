import React, { useState } from "react";
import {TextField,Button,Box,Typography,Link,ThemeProvider,createTheme,Paper,InputAdornment,} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

// Create a custom theme with a green pastel palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#7cb342", // Soft green
      light: "#aed581", // Light pastel green
      dark: "#558b2f", // Darker green for contrast
    },
    background: {
      default: "#f1f8e9", // Very light pastel green background
    },
    text: {
      primary: "#33691e", // Dark green for text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 20, // Curved textboxes
            backgroundColor: "#ffffff",
            "&:hover fieldset": {
              borderColor: "#7cb342",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7cb342",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Curved button
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(124, 179, 66, 0.3)",
            backgroundColor: "#8bc34a", // Slightly lighter green on hover
          },
        },
      },
    },
  },
});

const Login = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Formik validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setMessage("");
      try {
        const response = await axios.post("http://localhost:5000/api/users/login", values);
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        const role = decodedToken.role || "user";
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Something went wrong";
        if (errorMsg.toLowerCase().includes("email not verified")) {
          setMessage("Your email is not verified. Please check your email for the verification link.");
        } else {
          setMessage(errorMsg);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(124, 179, 66, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700, color: "primary.dark" }}>
            Login
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              required
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: "1rem", backgroundColor: "primary.main", color: "#fff" }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {message && (
            <Typography variant="body2" color="error" sx={{ mt: 1, mb: 2, textAlign: "center" }}>
              {message}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2, color: "text.primary" }}>
            Don't have an account?{" "}
            <Link href="/register" sx={{ color: "primary.dark", fontWeight: "medium" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
