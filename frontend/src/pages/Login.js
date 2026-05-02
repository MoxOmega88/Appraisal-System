/**
 * Login Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container, Box, Paper, TextField, Button, Typography,
  Alert, Link, Divider
} from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useAuth } from '../context/authContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if navigated from admin dashboard with user email
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setInfoMessage(location.state.message || 'Please log in as the selected user');
      // Clear the state after reading
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdminLogin) {
        // Admin login - login as a real user with admin credentials
        // This creates a proper JWT token for API calls
        try {
          await login(email, password);
          
          // After successful login, set admin flags
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminLoginTime', Date.now().toString());
          
          navigate('/admin-dashboard');
        } catch (err) {
          setError('Invalid admin credentials');
        }
      } else {
        // Regular user login
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setError('');
    setInfoMessage('');
    setEmail('');
    setPassword('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
            Faculty Appraisal System
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isAdminLogin ? 'Admin Login' : 'Sign in to manage your appraisal records'}
          </Typography>

          {infoMessage && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {infoMessage}
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Admin Login Toggle */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AdminIcon />}
              onClick={toggleAdminLogin}
              fullWidth
              sx={{ 
                py: 1.2,
                borderColor: isAdminLogin ? '#d32f2f' : '#1976d2',
                color: isAdminLogin ? '#d32f2f' : '#1976d2',
                '&:hover': {
                  borderColor: isAdminLogin ? '#c62828' : '#1565c0',
                  backgroundColor: isAdminLogin ? '#ffebee' : '#e3f2fd'
                }
              }}
            >
              {isAdminLogin ? 'Back to User Login' : 'Admin Login'}
            </Button>
          </Box>

          {!isAdminLogin && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register">
                  Register here
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
