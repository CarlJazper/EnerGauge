import { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

      // Store the token in sessionStorage
      sessionStorage.setItem('token', response.data.token);

      // Decode the token to extract the role
      const decodedToken = jwtDecode(response.data.token);
      const role = decodedToken.role || 'user'; // Default to 'user' if role is not in token

      // Store the role in sessionStorage
      sessionStorage.setItem('role', role);

      // Redirect to home or dashboard after successful registration
      navigate('/'); 
    } catch (error) {
      setMessage(error.response?.data.message || "Something went wrong");
    }
  };

  return (
    <Box sx={{ width: 400, margin: 'auto', mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>Register</Typography>
      
      <TextField label="First Name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Last Name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
      <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" fullWidth onClick={handleRegister} sx={{ mb: 2 }}>Register</Button>
      {message && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{message}</Typography>}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">Already have an account? </Typography>
        <Link href="/login" sx={{ color: 'primary.main' }}>Login here</Link>
      </Box>

    </Box>
  );
};

export default Register;
