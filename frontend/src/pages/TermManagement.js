/**
 * Term Management Page
 * CRUD operations for appraisal terms
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { termService } from '../services/api';

export default function TermManagement() {
  const [terms, setTerms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTerm, setCurrentTerm] = useState({
    termName: '',
    academicYear: '',
    startDate: '',
    endDate: '',
    durationMonths: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await termService.getAll();
      setTerms(response.data);
    } catch (error) {
      setError('Failed to fetch terms');
    }
  };

  const handleCreate = async () => {
    try {
      await termService.create(currentTerm);
      setSuccess('Term created successfully');
      fetchTerms();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create term');
    }
  };

  const handleUpdate = async () => {
    try {
      await termService.update(currentTerm._id, currentTerm);
      setSuccess('Term updated successfully');
      fetchTerms();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update term');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this term? This action cannot be undone.')) {
      try {
        await termService.delete(id);
        setSuccess('Term deleted successfully');
        fetchTerms();
      } catch (error) {
        setError('Failed to delete term');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentTerm({
      termName: '',
      academicYear: '',
      startDate: '',
      endDate: '',
      durationMonths: '',
      isActive: true
    });
  };

  const handleEdit = (term) => {
    setCurrentTerm({
      ...term,
      startDate: term.startDate.split('T')[0],
      endDate: term.endDate.split('T')[0]
    });
    setEditMode(true);
    setOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Term Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage appraisal periods and terms
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Create New Term
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Term Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Academic Year</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Start Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>End Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Duration</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terms.map((term) => (
              <TableRow key={term._id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{term.termName}</TableCell>
                <TableCell>{term.academicYear}</TableCell>
                <TableCell>{new Date(term.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(term.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{term.durationMonths} months</TableCell>
                <TableCell>
                  <Chip
                    label={term.isActive ? 'Active' : 'Inactive'}
                    color={term.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(term)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(term._id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {terms.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No terms found. Create your first term to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'Merriweather' }}>
          {editMode ? 'Edit Term' : 'Create New Term'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term Name"
                value={currentTerm.termName}
                onChange={(e) => setCurrentTerm({...currentTerm, termName: e.target.value})}
                required
                placeholder="e.g., Monsoon 2024"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={currentTerm.academicYear}
                onChange={(e) => setCurrentTerm({...currentTerm, academicYear: e.target.value})}
                required
                placeholder="e.g., 2024-2025"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={currentTerm.startDate}
                onChange={(e) => setCurrentTerm({...currentTerm, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={currentTerm.endDate}
                onChange={(e) => setCurrentTerm({...currentTerm, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (Months)"
                type="number"
                value={currentTerm.durationMonths}
                onChange={(e) => setCurrentTerm({...currentTerm, durationMonths: e.target.value})}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editMode ? handleUpdate : handleCreate} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}