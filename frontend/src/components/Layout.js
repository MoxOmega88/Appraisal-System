/**
 * Layout Component
 * Main application layout with sidebar navigation
 */

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem
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
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/authContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Term Management', icon: <AssignmentIcon />, path: '/terms' },
  { divider: true, label: 'TEACHING & ACADEMICS' },
  { text: 'FCI Scores', icon: <MenuBookIcon />, path: '/fci-scores' },
  { divider: true, label: 'RESEARCH & PUBLICATIONS' },
  { text: 'Journal Papers', icon: <ScienceIcon />, path: '/journal-papers' },
  { text: 'Conference Papers', icon: <ScienceIcon />, path: '/conference-papers' },
  { text: 'Non-Indexed Publications', icon: <ScienceIcon />, path: '/non-indexed-publications' },
  { text: 'Books & Chapters', icon: <MenuBookIcon />, path: '/books' },
  { text: 'Disclosures', icon: <ScienceIcon />, path: '/disclosures' },
  { text: 'Patents', icon: <ScienceIcon />, path: '/patents' },
  { divider: true, label: 'RESEARCH GUIDANCE' },
  { text: 'Research Guidance', icon: <SchoolIcon />, path: '/research-guidance' },
  { divider: true, label: 'PROJECTS' },
  { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
  { divider: true, label: 'PROFESSIONAL ACTIVITIES' },
  { text: 'Professional Activities', icon: <BusinessIcon />, path: '/professional-activities' },
  { text: 'Events', icon: <EventIcon />, path: '/events' },
  { text: 'Services', icon: <BusinessIcon />, path: '/services' },
  { divider: true, label: 'RECOGNITION' },
  { text: 'Awards & Others', icon: <EmojiEventsIcon />, path: '/awards' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
    </Box>
  );
}