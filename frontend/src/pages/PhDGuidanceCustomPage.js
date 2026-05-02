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
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import FileUploadButton from '../components/FileUploadButton';
import { termService } from '../services/api';
import axios from 'axios';

const PhDGuidanceCustomPage = () => {
  const [data, setData] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    numberOfScholars: 0,
    researchArea: '',
    status: 'Ongoing'
  });
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await termService.getAll();
      const termsData = response.data?.data || response.data || [];
      setTerms(termsData);
      if (termsData.length > 0) {
        setSelectedTerm(termsData[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch terms');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/phd-guidance?termId=${selectedTerm}`);
      const itemsData = response.data?.data || response.data || [];
      console.log('Fetched PhD Guidance data:', itemsData);
      console.log('First item scholars:', itemsData[0]?.scholars);
      setData(itemsData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      console.log('Opening edit for item:', item);
      console.log('Item scholars:', item.scholars);
      setEditMode(true);
      setCurrentItemId(item._id);
      setFormData({
        numberOfScholars: item.numberOfScholars || 0,
        researchArea: item.researchArea || '',
        status: item.status || 'Ongoing'
      });
      setScholars(item.scholars || []);
    } else {
      setEditMode(false);
      setCurrentItemId(null);
      setFormData({
        numberOfScholars: 0,
        researchArea: '',
        status: 'Ongoing'
      });
      setScholars([]);
    }
    setUploadedFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ numberOfScholars: 0, researchArea: '', status: 'Ongoing' });
    setScholars([]);
    setUploadedFiles([]);
    setError('');
    setCurrentItemId(null);
  };

  const handleNumberChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setFormData({ ...formData, numberOfScholars: count });
    
    // Create array of scholar objects
    const newScholars = Array.from({ length: count }, (_, i) => {
      // Preserve existing scholar data if available
      if (scholars[i]) {
        return scholars[i];
      }
      return { name: '' };
    });
    setScholars(newScholars);
  };

  const handleScholarChange = (index, value) => {
    const updated = [...scholars];
    updated[index].name = value;
    setScholars(updated);
  };

  const handleFileSelect = (files) => {
    setUploadedFiles(files || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      submitData.append('termId', selectedTerm);
      submitData.append('numberOfScholars', formData.numberOfScholars);
      submitData.append('researchArea', formData.researchArea);
      submitData.append('status', formData.status);
      
      // Send scholars as JSON string
      submitData.append('scholars', JSON.stringify(scholars));

      // Debug log
      console.log('Submitting scholars:', scholars);
      console.log('Scholars JSON:', JSON.stringify(scholars));

      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
          submitData.append('documents', file);
        });
      }

      if (editMode) {
        const response = await axios.put(`/api/phd-guidance/${currentItemId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Update response:', response.data);
        setSuccess('Record updated successfully');
      } else {
        const response = await axios.post(`/api/phd-guidance`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Create response:', response.data);
        setSuccess('Record created successfully');
      }

      fetchData();
      handleClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api/phd-guidance/${id}`);
        setSuccess('Record deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete record');
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          PhD Research Guidance
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={!selectedTerm}
          sx={{ 
            backgroundColor: '#1a237e',
            '&:hover': { backgroundColor: '#0d1642' }
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Term Selection */}
      <Box mb={3}>
        <TextField
          select
          label="Select Term"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
        >
          {terms.map((term) => (
            <option key={term._id} value={term._id}>
              {term.termName} ({term.academicYear})
            </option>
          ))}
        </TextField>
      </Box>

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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Number of Scholars</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Scholars</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Research Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">File</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" py={4}>
                      No records found. Click "Add New" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.numberOfScholars || '-'}</TableCell>
                    <TableCell>
                      {item.scholars && item.scholars.length > 0 ? (
                        <Box>
                          {item.scholars.map((scholar, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                              {scholar.name}
                            </Typography>
                          ))}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{item.researchArea || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status || '-'} 
                        size="small"
                        color={
                          item.status === 'Completed' ? 'success' : 
                          item.status === 'Submitted' ? 'info' : 
                          'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      {item.documents && item.documents.length > 0 ? (
                        <Chip
                          icon={<AttachFileIcon />}
                          label={`${item.documents.length} file(s)`}
                          size="small"
                          color="primary"
                          onClick={() => {
                            const doc = item.documents[0];
                            const normalizedPath = doc.filePath.replace(/\\/g, '/');
                            const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
                            window.open(`http://localhost:5000${urlPath}`, '_blank');
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <Chip label="No Files" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(item)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(item._id)} size="small">
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
          {editMode ? 'Edit PhD Research Guidance' : 'Add New PhD Research Guidance'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="phd-guidance-form" onSubmit={handleSubmit} pt={1}>
            <TextField
              fullWidth
              margin="normal"
              label="Number of Scholars *"
              type="number"
              value={formData.numberOfScholars}
              onChange={handleNumberChange}
              helperText="Enter the number of scholars to add their details"
              InputProps={{ inputProps: { min: 1 } }}
              InputLabelProps={{ shrink: true }}
              required
            />

            {scholars.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Scholar Names
                </Typography>
                {scholars.map((scholar, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Scholar ${index + 1} Name *`}
                    value={scholar.name}
                    onChange={(e) => handleScholarChange(index, e.target.value)}
                    helperText="Enter scholar's full name"
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                ))}
                <Divider sx={{ my: 2 }} />
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Research Area *"
              value={formData.researchArea}
              onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
              required
              helperText="Enter the research area"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              select
              margin="normal"
              label="Status *"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              helperText="Select the current status"
              InputLabelProps={{ shrink: true }}
              required
            >
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
            </TextField>

            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Upload Supporting Document
              </Typography>
              <FileUploadButton
                onFileSelect={handleFileSelect}
                label="Upload Proof/Certificate"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            form="phd-guidance-form"
            variant="contained"
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

export default PhDGuidanceCustomPage;
