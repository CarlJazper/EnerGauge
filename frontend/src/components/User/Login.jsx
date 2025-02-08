import { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      // Store token in sessionStorage
      sessionStorage.setItem('token', response.data.token);

      // Decode the token to extract the role
      const decodedToken = jwtDecode(response.data.token);
      const role = decodedToken.role || 'user'; // Default to 'user' if no role is found

      // Store role in sessionStorage
      sessionStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: 400, margin: 'auto', mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>Login</Typography>
      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mb: 2 }} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      {message && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{message}</Typography>}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">Don't have an account? </Typography>
        <Link href="/register" sx={{ color: 'primary.main' }}>Register here</Link>
      </Box>
    </Box>
  );
};

export default Login;
