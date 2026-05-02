/**
 * Layout Component
 * Main application layout with sidebar navigation
 */

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, CircularProgress, Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  Science as ScienceIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  EmojiEvents as EmojiEventsIcon,
  Menu as MenuIcon,
  AccountCircle,
  Lock as LockIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/authContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Term Management', icon: <AssignmentIcon />, path: '/terms' },
  { divider: true, label: 'TEACHING & ACADEMICS' },
  { text: 'FCI Score', icon: <MenuBookIcon />, path: '/fci-scores' },
  { divider: true, label: 'RESEARCH & PUBLICATIONS' },
  { text: 'Refereed Journal Papers', icon: <ScienceIcon />, path: '/journal-papers' },
  { text: 'Indexed Conference Papers', icon: <ScienceIcon />, path: '/conference-papers' },
  { text: 'Non-Indexed Publications', icon: <ScienceIcon />, path: '/non-indexed-publications' },
  { text: 'Books / Chapters', icon: <MenuBookIcon />, path: '/books' },
  { text: 'Disclosures Filed', icon: <ScienceIcon />, path: '/disclosures' },
  { text: 'Patents Granted', icon: <ScienceIcon />, path: '/patents' },
  { divider: true, label: 'RESEARCH GUIDANCE' },
  { text: 'UG Guidance', icon: <SchoolIcon />, path: '/ug-guidance' },
  { text: "Master's Guidance", icon: <SchoolIcon />, path: '/masters-guidance' },
  { text: 'PhD Guidance', icon: <SchoolIcon />, path: '/phd-guidance' },
  { divider: true, label: 'PROJECTS & CONSULTING' },
  { text: 'Funded Projects', icon: <WorkIcon />, path: '/funded-projects' },
  { text: 'Consulting Projects', icon: <WorkIcon />, path: '/consulting-projects' },
  { divider: true, label: 'PROFESSIONAL ACTIVITIES' },
  { text: 'Conference/Reviewer Roles', icon: <BusinessIcon />, path: '/reviewer-roles' },
  { text: 'FDP / Events Organized', icon: <EventIcon />, path: '/fdp-organized' },
  { divider: true, label: 'LECTURES & EVENTS' },
  { text: 'Invited Talks Outside', icon: <EventIcon />, path: '/invited-talks' },
  { text: 'Events Outside Institute', icon: <EventIcon />, path: '/events-outside' },
  { text: 'Events Inside Institute', icon: <EventIcon />, path: '/events-inside' },
  { divider: true, label: 'RELATIONS & SERVICES' },
  { text: 'Industry Relations', icon: <BusinessIcon />, path: '/industry-relations' },
  { text: 'Institutional Services', icon: <BusinessIcon />, path: '/institutional-services' },
  { text: 'Other Services', icon: <BusinessIcon />, path: '/other-services' },
  { divider: true, label: 'RECOGNITION' },
  { text: 'Awards & Honours', icon: <EmojiEventsIcon />, path: '/awards' },
  { text: 'Professionalism / Team Spirit', icon: <EmojiEventsIcon />, path: '/professionalism' },
  { text: 'Other Major Contributions', icon: <EmojiEventsIcon />, path: '/other-contributions' }
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
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

  const handleChangePasswordSubmit = async () => {
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

    try {
      // Call API to change password using axios
      const response = await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        setChangingPassword(false);
        setChangePasswordOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully!');
      }
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Error changing password. Please try again.';
      setPasswordError(errorMessage);
      setChangingPassword(false);
    }
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', bgcolor: '#1a365d', height: '100%' }}>
      <Box sx={{ p: 3, bgcolor: '#0f2540', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Merriweather' }}>
          Faculty Appraisal
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Management System
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ color: 'white', pt: 2 }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <Box key={index}>
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: 1
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }
          return (
            <ListItem key={index} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Faculty Appraisal System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                {user?.name?.[0]}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Typography variant="caption">
                {user?.employeeId} • {user?.department}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Last Login: {user?.lastLogin 
                  ? new Date(user.lastLogin).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'First Login'}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleChangePasswordClick}>
              <LockIcon sx={{ mr: 1, fontSize: 20 }} />
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>

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
              Change Password
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