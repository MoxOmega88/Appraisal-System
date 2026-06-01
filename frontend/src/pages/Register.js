/**
 * Register Page
 */

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Paper, TextField, Button, Typography,
  Alert, Link, Grid
} from '@mui/material';
import { useAuth } from '../context/authContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email domain
    if (!formData.email.endsWith('@msrit.edu')) {
      setError('Email must be from @msrit.edu domain');
      return;
    }

    // Validate employee ID (exactly 5 digits)
    if (!/^\d{5}$/.test(formData.employeeId)) {
      setError('Employee ID must be exactly 5 digits');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
            Faculty Registration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Create your account to access the appraisal system
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  helperText="Must be @msrit.edu email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  helperText="Minimum 6 characters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  helperText="Must be exactly 5 digits"
                  inputProps={{ maxLength: 5, pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}