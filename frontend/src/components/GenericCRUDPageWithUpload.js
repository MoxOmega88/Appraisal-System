import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import FileUploadButton from './FileUploadButton';
import { termService } from '../services/api';
import axios from 'axios';

const GenericCRUDPageWithUpload = ({ 
  title, 
  apiEndpoint, 
  fields, 
  termRequired = true,
  supportsFileUpload = true 
}) => {
  const [data, setData] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (termRequired) {
      fetchTerms();
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await termService.getAll();
      setTerms(response.data);
      if (response.data.length > 0) {
        setSelectedTerm(response.data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch terms');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = termRequired ? `/api${apiEndpoint}?termId=${selectedTerm}` : `/api${apiEndpoint}`;
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      setCurrentItem(item);
    } else {
      setEditMode(false);
      const initialItem = {};
      fields.forEach(field => {
        initialItem[field.name] = field.type === 'date' ? '' : '';
      });
      if (termRequired) {
        initialItem.termId = selectedTerm;
      }
      setCurrentItem(initialItem);
    }
    setUploadedFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem({});
    setUploadedFile(null);
    setError('');
  };

  const handleChange = (e) => {
    setCurrentItem({
      ...currentItem,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all fields
      Object.keys(currentItem).forEach(key => {
        if (currentItem[key] !== null && currentItem[key] !== undefined) {
          formData.append(key, currentItem[key]);
        }
      });

      // Append file if selected
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      if (editMode) {
        await axios.put(`/api${apiEndpoint}/${currentItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Record updated successfully');
      } else {
        await axios.post(`/api${apiEndpoint}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Record created successfully');
      }

      fetchData();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api${apiEndpoint}/${id}`);
        setSuccess('Record deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete record');
      }
    }
  };

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <TextField
          key={field.name}
          select
          fullWidth
          margin="normal"
          label={field.label}
          name={field.name}
          value={currentItem[field.name] || ''}
          onChange={handleChange}
          required={field.required}
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (field.type === 'textarea') {
      return (
        <TextField
          key={field.name}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label={field.label}
          name={field.name}
          value={currentItem[field.name] || ''}
          onChange={handleChange}
          required={field.required}
        />
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        margin="normal"
        label={field.label}
        name={field.name}
        type={field.type}
        value={currentItem[field.name] || ''}
        onChange={handleChange}
        required={field.required}
        InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={termRequired && !selectedTerm}
          sx={{ 
            backgroundColor: '#1a237e',
            '&:hover': { backgroundColor: '#0d1642' }
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Term Selection */}
      {termRequired && (
        <Box mb={3}>
          <TextField
            select
            label="Select Term"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            sx={{ minWidth: 300 }}
          >
            {terms.map((term) => (
              <MenuItem key={term._id} value={term._id}>
                {term.termName} ({term.academicYear})
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Data Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a237e' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sl No</TableCell>
                {fields.slice(0, 4).map((field) => (
                  <TableCell key={field.name} sx={{ color: 'white', fontWeight: 'bold' }}>
                    {field.label}
                  </TableCell>
                ))}
                {supportsFileUpload && (
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                    File
                  </TableCell>
                )}
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 3} align="center">
                    <Typography variant="body1" color="text.secondary" py={4}>
                      No records found. Click "Add New" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    {fields.slice(0, 4).map((field) => (
                      <TableCell key={field.name}>
                        {field.type === 'date' && item[field.name]
                          ? new Date(item[field.name]).toLocaleDateString()
                          : item[field.name] || '-'}
                      </TableCell>
                    ))}
                    {supportsFileUpload && (
                      <TableCell align="center">
                        {item.filePath ? (
                          <Chip
                            icon={<AttachFileIcon />}
                            label="View"
                            size="small"
                            color="primary"
                            onClick={() => window.open(`http://localhost:5000${item.filePath}`, '_blank')}
                            sx={{ cursor: 'pointer' }}
                          />
                        ) : (
                          <Chip label="No File" size="small" variant="outlined" />
                        )}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(item)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? `Edit ${title}` : `Add New ${title}`}
        </DialogTitle>
        <DialogContent>
          <Box pt={1}>
            {fields.map(renderField)}
            
            {supportsFileUpload && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Supporting Document
                </Typography>
                <FileUploadButton
                  onFileSelect={handleFileSelect}
                  label="Upload Proof/Certificate"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ 
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d1642' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GenericCRUDPageWithUpload;
