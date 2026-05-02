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
  Grid,
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

const MastersGuidanceCustomPage = () => {
  const [data, setData] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    numberOfStudents: 0,
    thesisTitle: '',
    remarks: ''
  });
  const [students, setStudents] = useState([]);
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
      const response = await axios.get(`/api/masters-guidance?termId=${selectedTerm}`);
      const itemsData = response.data?.data || response.data || [];
      console.log('Fetched Masters Guidance data:', itemsData);
      console.log('First item students:', itemsData[0]?.students);
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
      console.log('Item students:', item.students);
      setEditMode(true);
      setCurrentItemId(item._id);
      setFormData({
        numberOfStudents: item.numberOfStudents || 0,
        thesisTitle: item.thesisTitle || '',
        remarks: item.remarks || ''
      });
      setStudents(item.students || []);
    } else {
      setEditMode(false);
      setCurrentItemId(null);
      setFormData({
        numberOfStudents: 0,
        thesisTitle: '',
        remarks: ''
      });
      setStudents([]);
    }
    setUploadedFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ numberOfStudents: 0, thesisTitle: '', remarks: '' });
    setStudents([]);
    setUploadedFiles([]);
    setError('');
    setCurrentItemId(null);
  };

  const handleNumberChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setFormData({ ...formData, numberOfStudents: count });
    
    // Create array of student objects
    const newStudents = Array.from({ length: count }, (_, i) => {
      // Preserve existing student data if available
      if (students[i]) {
        return students[i];
      }
      return { name: '', usn: '' };
    });
    setStudents(newStudents);
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
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
      submitData.append('numberOfStudents', formData.numberOfStudents);
      submitData.append('thesisTitle', formData.thesisTitle);
      submitData.append('remarks', formData.remarks);
      
      // Send students as JSON string
      submitData.append('students', JSON.stringify(students));

      // Debug log
      console.log('Submitting students:', students);
      console.log('Students JSON:', JSON.stringify(students));

      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => {
          submitData.append('documents', file);
        });
      }

      if (editMode) {
        const response = await axios.put(`/api/masters-guidance/${currentItemId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Update response:', response.data);
        setSuccess('Record updated successfully');
      } else {
        const response = await axios.post(`/api/masters-guidance`, submitData, {
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
        await axios.delete(`/api/masters-guidance/${id}`);
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
          Master's Research Guidance
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Number of Students</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Students</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thesis Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
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
                    <TableCell>{item.numberOfStudents || '-'}</TableCell>
                    <TableCell>
                      {item.students && item.students.length > 0 ? (
                        <Box>
                          {item.students.map((student, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                              {idx + 1}. {student.name} ({student.usn})
                            </Typography>
                          ))}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{item.thesisTitle || '-'}</TableCell>
                    <TableCell>{item.remarks || '-'}</TableCell>
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
          {editMode ? "Edit Master's Research Guidance" : "Add New Master's Research Guidance"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="masters-guidance-form" onSubmit={handleSubmit} pt={1}>
            <TextField
              fullWidth
              margin="normal"
              label="Number of Students *"
              type="number"
              value={formData.numberOfStudents}
              onChange={handleNumberChange}
              helperText="Enter the number of students to add their details"
              InputProps={{ inputProps: { min: 1 } }}
              InputLabelProps={{ shrink: true }}
              required
            />

            {students.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Student Details
                </Typography>
                {students.map((student, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label={`Student ${index + 1} Name *`}
                        value={student.name}
                        onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                        helperText="Enter student's full name"
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label={`Student ${index + 1} USN *`}
                        value={student.usn}
                        onChange={(e) => handleStudentChange(index, 'usn', e.target.value)}
                        helperText="Enter student's USN"
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                  </Grid>
                ))}
                <Divider sx={{ my: 2 }} />
              </>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Thesis Title *"
              value={formData.thesisTitle}
              onChange={(e) => setFormData({ ...formData, thesisTitle: e.target.value })}
              required
              helperText="Enter the thesis title"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Remarks"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              helperText="Add any additional notes or comments"
              InputLabelProps={{ shrink: true }}
            />

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
            form="masters-guidance-form"
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

export default MastersGuidanceCustomPage;
