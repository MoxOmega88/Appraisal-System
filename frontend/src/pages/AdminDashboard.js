/**
 * Admin Dashboard
 * Displays all registered users
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon,
  Login as LoginIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    // Check admin session timeout (24 hours)
    const adminLoginTime = localStorage.getItem('adminLoginTime');
    if (adminLoginTime) {
      const now = Date.now();
      const hoursPassed = (now - parseInt(adminLoginTime)) / (1000 * 60 * 60);
      
      if (hoursPassed > 24) {
        // Session expired
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminPassword');
        alert('Admin session expired. Please login again.');
        navigate('/login');
        return;
      }
    } else {
      // No login time recorded, set it now
      localStorage.setItem('adminLoginTime', Date.now().toString());
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePasswordClick = () => {
    handleMenuClose();
    setChangePasswordOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleChangePasswordClose = () => {
    if (!changingPassword) {
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  };

  const handleChangePasswordSubmit = () => {
    // Get current admin password from localStorage or use default
    const storedAdminPassword = localStorage.getItem('adminPassword') || 'admin123';
    
    // Verify current password
    if (currentPassword !== storedAdminPassword) {
      setPasswordError('Current password is incorrect');
      return;
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    setPasswordError('');

    // Save new password to localStorage
    setTimeout(() => {
      localStorage.setItem('adminPassword', newPassword);
      setChangingPassword(false);
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully! You can now login with your new password.\n\nNote: For production use, admin credentials should be stored in a secure database, not in browser storage.');
    }, 1000);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setAdminPassword('');
    setDeleteError('');
  };

  const handleLoginAsUser = (user) => {
    // Navigate to login page with user email as hint
    navigate('/login', { state: { email: user.email, message: 'Please log in as the selected user' } });
  };

  const handleDeleteConfirm = async () => {
    // Verify admin password
    if (adminPassword !== 'admin123') {
      setDeleteError('Invalid admin password');
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      await axios.delete(`/api/auth/users/${selectedUser._id}`);
      
      // Remove user from UI list
      setUsers(users.filter(u => u._id !== selectedUser._id));
      
      // Close dialog
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setAdminPassword('');
      
      // Show success message
      setError('');
    } catch (err) {
      setDeleteError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDialogClose = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setAdminPassword('');
      setDeleteError('');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastLogin = (date) => {
    if (!date) return 'Never Logged In';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <AdminIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage all registered faculty users
                </Typography>
              </Box>
            </Box>
            
            {/* Admin Profile Menu */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight="600">
                  Administrator
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@gmail.com
                </Typography>
              </Box>
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                  <AdminIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      Administrator
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      admin@gmail.com
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleChangePasswordClick}>
                  <LockIcon sx={{ mr: 1, fontSize: 20 }} />
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Paper>

        {/* Users Table */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Registered Users
            </Typography>
            <Chip 
              label={`Total: ${users.length}`} 
              color="primary" 
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={60} />
            </Box>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No users found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>S.No.</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Joining Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Registered On</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow 
                      key={user._id}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        '&:nth-of-type(even)': { backgroundColor: '#fafafa' }
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.employeeId}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.designation}</TableCell>
                      <TableCell>{formatDate(user.joiningDate)}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: user.lastLogin ? '#2e7d32' : '#757575',
                            fontStyle: user.lastLogin ? 'normal' : 'italic'
                          }}
                        >
                          {formatLastLogin(user.lastLogin)}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleLoginAsUser(user)}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#e3f2fd'
                              }
                            }}
                            title="Login as User"
                          >
                            <LoginIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(user)}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#ffebee'
                              }
                            }}
                            title="Delete User"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#d32f2f', color: 'white' }}>
          <Typography variant="h6" fontWeight="bold">
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {selectedUser && (
            <Box mb={2}>
              <Typography variant="body1" gutterBottom>
                You are about to delete the following user:
              </Typography>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5', mt: 2 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedUser.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Employee ID:</strong> {selectedUser.employeeId}
                </Typography>
              </Paper>
            </Box>
          )}

          <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight: 600 }}>
            This action cannot be undone. Enter admin password to confirm.
          </Typography>

          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            disabled={deleting}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && adminPassword) {
                handleDeleteConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            onClick={handleDialogClose}
            variant="outlined"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={!adminPassword || deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={handleChangePasswordClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <LockIcon />
            <Typography variant="h6" fontWeight="bold">
              Change Admin Password
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your current password and choose a new password
          </Typography>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            margin="normal"
            disabled={changingPassword}
            autoFocus
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 characters)"
            margin="normal"
            disabled={changingPassword}
            helperText="Password must be at least 6 characters"
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            margin="normal"
            disabled={changingPassword}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && currentPassword && newPassword && confirmPassword) {
                handleChangePasswordSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            onClick={handleChangePasswordClose}
            variant="outlined"
            disabled={changingPassword}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePasswordSubmit}
            variant="contained"
            color="primary"
            disabled={!currentPassword || !newPassword || !confirmPassword || changingPassword}
            startIcon={changingPassword ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
