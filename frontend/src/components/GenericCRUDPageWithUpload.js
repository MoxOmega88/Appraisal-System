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
  CircularProgress,
  Grid
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
  supportsFileUpload = true,
  autoCalcDuration = false
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
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const isReviewerRoles = apiEndpoint === '/reviewer-roles';

  const calculateDuration = (start, end) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? String(diffDays) : '0';
  };

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
      // Handle both structured { success, data } and legacy array responses
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
      const url = termRequired ? `/api${apiEndpoint}?termId=${selectedTerm}` : `/api${apiEndpoint}`;
      const response = await axios.get(url);
      // Handle both structured { success, data } and legacy array responses
      const itemsData = response.data?.data || response.data || [];
      setData(itemsData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      const itemWithDetails = { ...item };
      // EDIT MODE: populate details from the correct backend field
      itemWithDetails.details =
        item.type === 'Journal'
          ? item.quartile || ''
          : item.type === 'Conference'
          ? item.conferenceDetails || ''
          : '';
      // FIX: ensure month and year are numbers so the select value matches option values
      itemWithDetails.month = item.month != null ? Number(item.month) : '';
      itemWithDetails.year = item.year != null ? Number(item.year) : '';
      setCurrentItem(itemWithDetails);
    } else {
      // Check if this is FCI Score module and if there's already an entry
      if (apiEndpoint === '/fci-scores' && data.length > 0) {
        setError('Only one FCI Score entry is allowed per term. Please delete the existing entry before adding a new one.');
        return;
      }
      
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
    setUploadedFiles([]);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = {
      ...currentItem,
      [name]: value
    };

    // SUBMIT MAPPING: keep quartile/conferenceDetails in sync as user types
    if (name === 'details') {
      updatedItem.quartile = currentItem.type === 'Journal' ? value : null;
      updatedItem.conferenceDetails = currentItem.type === 'Conference' ? value : null;
    }

    // Clear details + mapped fields when type changes
    if (name === 'type') {
      updatedItem.details = '';
      updatedItem.quartile = null;
      updatedItem.conferenceDetails = null;
    }

    // Auto-calculate duration when start or end date changes
    if (autoCalcDuration && (name === 'startDate' || name === 'endDate')) {
      const start = name === 'startDate' ? value : currentItem.startDate;
      const end = name === 'endDate' ? value : currentItem.endDate;
      if (start && end && new Date(end) < new Date(start)) {
        setError('End Date cannot be before Start Date');
      } else {
        setError('');
        updatedItem.durationCategory = calculateDuration(start, end);
      }
    }

    setCurrentItem(updatedItem);
  };

  const handleFileSelect = (files) => {
    setUploadedFiles(files || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Browser validation has already passed if we reach here
    try {
      setLoading(true);
      setError('');

      // Create FormData for file upload
      const formData = new FormData();
      
      // Prepare data with conditional field handling
      const dataToSubmit = { ...currentItem };

      // FIX: convert month and year to Number before building FormData
      // FormData always sends strings; explicit Number() ensures correct type on backend
      if (dataToSubmit.month !== '' && dataToSubmit.month !== null && dataToSubmit.month !== undefined) {
        dataToSubmit.month = Number(dataToSubmit.month);
      }
      if (dataToSubmit.year !== '' && dataToSubmit.year !== null && dataToSubmit.year !== undefined) {
        dataToSubmit.year = Number(dataToSubmit.year);
      }
      
      // MAPPING FIX: map details → quartile or conferenceDetails before sending
      if (dataToSubmit.details !== undefined) {
        dataToSubmit.quartile =
          dataToSubmit.type === 'Journal' ? dataToSubmit.details : null;
        dataToSubmit.conferenceDetails =
          dataToSubmit.type === 'Conference' ? dataToSubmit.details : null;
        delete dataToSubmit.details; // don't send the UI-only field
      }

      // Handle other conditional fields - clear them if their condition is not met
      fields.forEach(field => {
        if (field.conditional) {
          const { field: condField, value: condValue } = field.conditional;
          if (dataToSubmit[condField] !== condValue) {
            dataToSubmit[field.name] = '';
          }
        }
      });
      
      // Append all fields
      Object.keys(dataToSubmit).forEach(key => {
        const val = dataToSubmit[key];
        if (val !== null && val !== undefined && val !== '') {
          formData.append(key, val);
        }
      });

      // Append file if selected
      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
          formData.append('documents', file);
        });
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
    // Check if field should be conditionally rendered
    if (field.conditional) {
      const { field: condField, value: condValue } = field.conditional;
      if (currentItem[condField] !== condValue) {
        return null;
      }
    }

    // For reviewer-roles: hide 'details' field unless type is selected
    if (isReviewerRoles && field.name === 'details') {
      if (!currentItem.type) return null;
    }

    // Get dynamic label if available
    const fieldLabel = field.dynamicLabel ? field.dynamicLabel(currentItem) : field.label;

    // For reviewer-roles we handle required ourselves — use native HTML5 validation
    const isRequired = field.required;
    // Show * on label if field is marked required
    const labelWithAsterisk = field.required ? `${fieldLabel} *` : fieldLabel;

    // Generate helpful helper text based on field name
    const generateHelperText = () => {
      const fieldName = field.name.toLowerCase();
      let helperText = '';

      // Helper text for common field patterns
      if (fieldName.includes('title') || fieldName === 'title') {
        helperText = 'Enter a descriptive title';
      } else if (fieldName.includes('name') && !fieldName.includes('venue') && !fieldName.includes('journal') && !fieldName.includes('conference')) {
        helperText = 'Enter a meaningful name';
      } else if (fieldName.includes('project')) {
        helperText = 'Enter the project name';
      } else if (fieldName.includes('venue')) {
        helperText = 'Enter the venue or journal/conference name';
      } else if (fieldName.includes('description')) {
        helperText = 'Provide detailed information';
      } else if (fieldName.includes('remarks')) {
        helperText = 'Add any additional notes or comments';
      } else if (fieldName.includes('organization')) {
        helperText = 'Enter the organization name';
      } else if (fieldName.includes('company')) {
        helperText = 'Enter the company name';
      } else if (fieldName.includes('service')) {
        helperText = 'Enter the service name or description';
      } else if (fieldName.includes('event')) {
        helperText = 'Enter the event name';
      } else if (fieldName.includes('scholar')) {
        helperText = 'Enter the scholar name';
      } else if (fieldName.includes('student')) {
        helperText = 'Enter student name or count';
      } else if (fieldName.includes('amount')) {
        helperText = 'Enter the amount in rupees';
      } else if (fieldName.includes('year')) {
        helperText = 'Enter the year (e.g., 2024)';
      }

      return helperText;
    };

    const helperText = generateHelperText();

    if (field.type === 'select') {
      return (
        <TextField
          key={field.name}
          select
          fullWidth
          margin="normal"
          label={labelWithAsterisk}
          name={field.name}
          value={currentItem[field.name] !== undefined ? currentItem[field.name] : ''}
          onChange={handleChange}
          required={isRequired}
          helperText={helperText}
          InputLabelProps={{ shrink: true }}
        >
          {field.options && field.options.map((option) => {
            const optionValue = typeof option === 'object' && option.value !== undefined ? option.value : option;
            const optionLabel = typeof option === 'object' && option.label !== undefined ? option.label : (typeof option === 'boolean' ? (option ? 'Yes' : 'No') : option);
            return (
              <MenuItem key={String(optionValue)} value={optionValue}>
                {optionLabel}
              </MenuItem>
            );
          })}
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
          label={labelWithAsterisk}
          name={field.name}
          value={currentItem[field.name] || ''}
          onChange={handleChange}
          required={isRequired}
          helperText={helperText}
          InputLabelProps={{ shrink: true }}
        />
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        margin="normal"
        label={labelWithAsterisk}
        name={field.name}
        type={field.type}
        value={currentItem[field.name] || ''}
        onChange={handleChange}
        required={isRequired}
        InputLabelProps={{ shrink: true }}
        inputProps={
          field.type === 'number' && (field.min !== undefined || field.max !== undefined)
            ? { min: field.min, max: field.max }
            : {}
        }
        helperText={helperText}
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
            InputLabelProps={{ shrink: true }}
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
                {fields.slice(0, 5).map((field) => {
                  // Skip fields marked as hideInTable
                  if (field.hideInTable) {
                    return null;
                  }
                  
                  // For conditional fields, show a combined header
                  if (field.conditional) {
                    const parentField = fields.find(f => f.name === field.conditional.field);
                    if (parentField) {
                      // Show combined label for conditional fields
                      return (
                        <TableCell key={field.name} sx={{ color: 'white', fontWeight: 'bold' }}>
                          {field.label}
                        </TableCell>
                      );
                    }
                  }
                  return (
                    <TableCell key={field.name} sx={{ color: 'white', fontWeight: 'bold' }}>
                      {field.label}
                    </TableCell>
                  );
                })}
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
                    {fields.slice(0, 5).map((field) => {
                      // Skip fields marked as hideInTable
                      if (field.hideInTable) {
                        return null;
                      }

                      // Use custom display function if provided
                      if (field.customDisplay) {
                        return (
                          <TableCell key={field.name}>
                            {field.customDisplay(item)}
                          </TableCell>
                        );
                      }

                      // Special handling for conditional fields in table display
                      if (field.conditional) {
                        const { field: condField, value: condValue } = field.conditional;
                        // Only show if condition is met
                        if (item[condField] !== condValue) {
                          return <TableCell key={field.name}>-</TableCell>;
                        }
                      }
                      
                      return (
                        <TableCell key={field.name}>
                          {field.type === 'date' && item[field.name]
                            ? new Date(item[field.name]).toLocaleDateString()
                            : item[field.name] || '-'}
                        </TableCell>
                      );
                    })}
                    {supportsFileUpload && (
                      <TableCell align="center">
                        {item.documents && item.documents.length > 0 ? (
                          <Chip
                            icon={<AttachFileIcon />}
                            label={`${item.documents.length} file(s)`}
                            size="small"
                            color="primary"
                            onClick={() => {
                              // Open first document - normalize path for Windows
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
          <Box pt={1} component="form" id="crud-form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {fields.map((field, index) => {
                const fieldElement = renderField(field);
                
                // If field has gridLayout, wrap in Grid item
                if (field.gridLayout) {
                  return (
                    <Grid item xs={field.gridLayout.xs || 12} key={field.name}>
                      {fieldElement}
                    </Grid>
                  );
                }
                
                // Otherwise, render in full width Grid item
                return (
                  <Grid item xs={12} key={field.name}>
                    {fieldElement}
                  </Grid>
                );
              })}
            </Grid>
            
            {supportsFileUpload && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Supporting Document
                </Typography>
                <FileUploadButton
                  onFileSelect={handleFileSelect}
                  label="Upload Proof/Certificate"
                  disabled={!editMode && uploadedFiles.length > 0}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            form="crud-form"
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

export default GenericCRUDPageWithUpload;
