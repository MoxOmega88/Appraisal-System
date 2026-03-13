/**
 * Generic CRUD Page Component - IMPROVED VERSION
 * With SweetAlert2 integration and better validation
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { termService } from '../services/api';
import Swal from 'sweetalert2';

export default function GenericCRUDPage({
  title,
  description,
  service,
  columns,
  formFields,
  initialFormData
}) {
  const [items, setItems] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchItems();
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await termService.getAll();
      const termsData = response.data || response;
      setTerms(termsData);
      if (termsData.length > 0) {
        setSelectedTerm(termsData[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch terms:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await service.getAll(selectedTerm);
      const itemsData = response.data || response;
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    for (const field of formFields) {
      if (field.required) {
        const value = currentItem[field.name];
        
        if (field.type === 'file') {
          if (editMode && currentItem.documents && currentItem.documents.length > 0) {
            continue;
          }
          if (!value) {
            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: `${field.label} is required`
            });
            return false;
          }
        } else if (!value || (typeof value === 'string' && value.trim() === '')) {
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `${field.label} is required`
          });
          return false;
        }
      }
    }

    if (currentItem.numberOfStudents !== undefined && currentItem.numberOfStudents < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Number of students cannot be negative'
      });
      return false;
    }

    if (currentItem.numberOfScholars !== undefined && currentItem.numberOfScholars < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Number of scholars cannot be negative'
      });
      return false;
    }

    if (currentItem.rating !== undefined && (currentItem.rating < 1 || currentItem.rating > 5)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Rating must be between 1 and 5'
      });
      return false;
    }

    return true;
  };

  const validateFile = (file) => {
    if (!file) return true;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Only PDF, JPG, JPEG, and PNG files are allowed'
      });
      return false;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 50MB'
      });
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const hasFileField = (service && service.proofAllowed) && formFields.some(f => f.type === 'file');
      let dataToSend = { ...currentItem, termId: selectedTerm };
      
      if (hasFileField) {
        const formData = new FormData();
        Object.keys(currentItem).forEach(key => {
          if (currentItem[key] instanceof File) {
            if (validateFile(currentItem[key])) {
              formData.append(key, currentItem[key]);
            }
          } else if (currentItem[key] !== undefined && currentItem[key] !== null) {
            // Include 0 and empty strings - backend will validate
            formData.append(key, currentItem[key]);
          }
        });
        formData.append('termId', selectedTerm);
        dataToSend = formData;
      }
      
      await service.create(dataToSend);
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Create error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const hasFileField = (service && service.proofAllowed) && formFields.some(f => f.type === 'file');
      let dataToSend = { ...currentItem };
      delete dataToSend._id;
      delete dataToSend.createdAt;
      delete dataToSend.updatedAt;
      delete dataToSend.facultyId;
      delete dataToSend.termId;
      
      if (hasFileField) {
        const formData = new FormData();
        Object.keys(dataToSend).forEach(key => {
          if (dataToSend[key] instanceof File) {
            if (validateFile(dataToSend[key])) {
              formData.append(key, dataToSend[key]);
            }
          } else if (dataToSend[key] !== undefined && dataToSend[key] !== null && key !== 'documents') {
            // Include 0 and empty strings - backend will validate
            formData.append(key, dataToSend[key]);
          }
        });
        dataToSend = formData;
      }
      
      await service.update(currentItem._id, dataToSend);
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await service.delete(id);
        fetchItems();
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentItem(initialFormData);
  };

  const handleEdit = (item) => {
    const formattedItem = { ...item };
    formFields.forEach(field => {
      if (field.type === 'date' && item[field.name]) {
        formattedItem[field.name] = item[field.name].split('T')[0];
      }
    });
    setCurrentItem(formattedItem);
    setEditMode(true);
    setOpen(true);
  };

  const handleFieldChange = (fieldName, value) => {
    setCurrentItem({ ...currentItem, [fieldName]: value });
  };

  const renderFormField = (field) => {
    if (field.type === 'select') {
      return (
        <FormControl fullWidth key={field.name}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={currentItem[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            label={field.label}
            required={field.required}
          >
            {field.options.map((option) => (
              <MenuItem key={option} value={option}>
                {typeof option === 'boolean' ? (option ? 'Yes' : 'No') : option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (field.type === 'file') {
      return (
        <Box key={field.name}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && validateFile(file)) {
                handleFieldChange(field.name, file);
              }
            }}
            required={field.required && !editMode}
            style={{ display: 'block', marginBottom: '8px' }}
          />
          <Typography variant="caption" color="text.secondary">
            {field.label} (PDF, JPG, PNG - Max 50MB)
          </Typography>
          {currentItem[field.name] && currentItem[field.name].name && (
            <Typography variant="caption" color="success.main" display="block">
              ✓ {currentItem[field.name].name}
            </Typography>
          )}
          {editMode && currentItem.documents && currentItem.documents.length > 0 && (
            <Typography variant="caption" color="info.main" display="block">
              📎 {currentItem.documents.length} file(s) uploaded
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        label={field.label}
        type={field.type || 'text'}
        value={currentItem[field.name] || ''}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        required={field.required}
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
        inputProps={field.inputProps}
        multiline={field.multiline}
        rows={field.rows}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Term</InputLabel>
              <Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Select Term"
              >
                {terms.map((term) => (
                  <MenuItem key={term._id} value={term._id}>
                    {term.termName} ({term.academicYear})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              disabled={!selectedTerm || loading}
              fullWidth
            >
              Add New Record
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ color: 'white', fontWeight: 600 }}>
                  {col.header}
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item._id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.render ? col.render(item[col.field], item) : item[col.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleEdit(item)} color="primary" size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id)} color="error" size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No records found. Add your first record to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'Merriweather' }}>
          {editMode ? 'Edit Record' : 'Add New Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {formFields.filter(f => !(f.type === 'file' && !(service && service.proofAllowed))).map((field) => (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                {renderFormField(field)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={editMode ? handleUpdate : handleCreate} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : (editMode ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
