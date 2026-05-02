/**
 * Professional Activities Page
 * Reviewer roles, FDP organized, and invited talks
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Chip,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Alert,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { reviewerRoleService, fdpOrganizedService, invitedTalkService, termService } from '../services/api';
import Swal from 'sweetalert2';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const emptyForm = {
  roleType: '', venueName: '', type: '', month: '', year: '',
  quartile: '', conferenceDetails: '', documents: null
};

function ReviewerRolesTab() {
  const [items, setItems] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    termService.getAll().then(res => {
      const data = res.data?.data || res.data || [];
      setTerms(data);
      if (data.length > 0) setSelectedTerm(data[0]._id);
    }).catch(() => setError('Failed to fetch terms'));
  }, []);

  useEffect(() => {
    if (selectedTerm) fetchItems();
  }, [selectedTerm]);

  const fetchItems = async () => {
    try {
      const res = await reviewerRoleService.getAll(selectedTerm);
      setItems(res.data?.data || res.data || []);
    } catch { setError('Failed to fetch records'); }
  };

  const handleClose = () => { setOpen(false); setEditMode(false); setForm(emptyForm); };

  const handleEdit = (item) => {
    setForm({
      _id: item._id,
      roleType: item.roleType || '',
      venueName: item.venueName || '',
      type: item.type || '',
      month: item.month || '',
      year: item.year || '',
      quartile: item.quartile || '',
      conferenceDetails: item.conferenceDetails || '',
      documents: null
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d32f2f', customClass: { container: 'swal-high-zindex' } });
    if (result.isConfirmed) {
      try {
        await reviewerRoleService.delete(id);
        fetchItems();
      } catch { setError('Failed to delete'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use native HTML5 validation instead of custom validation
    const payload = new FormData();
    payload.append('roleType', form.roleType);
    payload.append('venueName', form.venueName || '');
    payload.append('type', form.type || '');
    payload.append('month', form.month || '');
    payload.append('year', form.year || '');
    payload.append('quartile', form.type === 'Journal' ? (form.quartile || '') : '');
    payload.append('conferenceDetails', form.type === 'Conference' ? (form.conferenceDetails || '') : '');
    payload.append('termId', selectedTerm);
    if (form.documents instanceof File) payload.append('documents', form.documents);

    try {
      if (editMode) {
        await reviewerRoleService.update(form._id, payload);
      } else {
        await reviewerRoleService.create(payload);
      }
      fetchItems();
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save';
      Swal.fire({ icon: 'error', title: 'Error', text: msg, customClass: { container: 'swal-high-zindex' } });
    }
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Term</InputLabel>
              <Select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} label="Select Term">
                {terms.map(t => <MenuItem key={t._id} value={t._id}>{t.termName} ({t.academicYear})</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} disabled={!selectedTerm} fullWidth>
              Add New Reviewer Role
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              {['Role Type','Venue Name','Type','Details','Month / Year','Proof','Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id} hover>
                <TableCell>{item.roleType || '-'}</TableCell>
                <TableCell>{item.venueName || '-'}</TableCell>
                <TableCell>{item.type || '-'}</TableCell>
                <TableCell>
                  {item.type === 'Journal' ? (item.quartile || '-') : (item.conferenceDetails || '-')}
                </TableCell>
                <TableCell>
                  {item.month && item.year ? `${monthNames[item.month - 1]} ${item.year}` : '-'}
                </TableCell>
                <TableCell>
                  {item.documents && item.documents.length > 0
                    ? <a href={`http://localhost:5000${item.documents[0].filePath}`} target="_blank" rel="noopener noreferrer">View File</a>
                    : 'No proof'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} color="primary" size="small"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="error" size="small"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No records found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'Merriweather' }}>
          {editMode ? 'Edit Reviewer Role' : 'Add New Reviewer Roles'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="professional-form" onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role Type *</InputLabel>
                <Select value={form.roleType} onChange={e => set('roleType', e.target.value)} label="Role Type *" required>
                  {['Conference Chair','Session Chair','Reviewer'].map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Venue Name (Journal/Conference)" value={form.venueName} onChange={e => set('venueName', e.target.value)} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select value={form.type} onChange={e => set('type', e.target.value)} label="Type" required>
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Journal">Journal</MenuItem>
                  <MenuItem value="Conference">Conference</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {form.type === 'Journal' && (
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Quartile (Q1/Q2/Q3)" value={form.quartile} onChange={e => set('quartile', e.target.value)} InputLabelProps={{ shrink: true }} required />
              </Grid>
            )}
            {form.type === 'Conference' && (
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Conference Details" value={form.conferenceDetails} onChange={e => set('conferenceDetails', e.target.value)} InputLabelProps={{ shrink: true }} required />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Month</InputLabel>
                <Select value={form.month} onChange={e => set('month', e.target.value)} label="Month" required>
                  <MenuItem value="">None</MenuItem>
                  {monthNames.map((m, i) => <MenuItem key={i+1} value={i+1}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Year" type="number" value={form.year} onChange={e => set('year', e.target.value)} inputProps={{ min: 1900, max: 2100 }} InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>Upload Supporting Document</Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={e => set('documents', e.target.files[0] || null)}
                style={{ display: 'block' }}
              />
              <Typography variant="caption" color="text.secondary">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file, up to 10 files)
              </Typography>
            </Grid>
          </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="professional-form" variant="contained">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ProfessionalActivitiesPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Professional Activities
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Reviewer roles, events organized, and invited talks
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Reviewer Roles" />
          <Tab label="Events Organized" />
          <Tab label="Invited Talks" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <ReviewerRolesTab />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={fdpOrganizedService}
          columns={[
            { field: 'eventTitle', header: 'Event Title' },
            { field: 'durationCategory', header: 'Duration' },
            { field: 'startDate', header: 'Start Date', render: (val) => new Date(val).toLocaleDateString() },
            { field: 'endDate', header: 'End Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'eventTitle', label: 'Event Title', required: true, fullWidth: true },
            { name: 'durationCategory', label: 'Duration Category', type: 'select', required: true, options: ['5 Days', '3 Days', 'Other'] },
            { name: 'startDate', label: 'Start Date', type: 'date', required: true },
            { name: 'endDate', label: 'End Date', type: 'date' },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ eventTitle: '', durationCategory: '', startDate: '', endDate: '', proof: null }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GenericCRUDPage
          title=""
          description=""
          service={invitedTalkService}
          columns={[
            { field: 'title', header: 'Title' },
            { field: 'organization', header: 'Organization' },
            { field: 'date', header: 'Date', render: (val) => new Date(val).toLocaleDateString() },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'title', label: 'Talk Title', required: true, fullWidth: true },
            { name: 'organization', label: 'Organization', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ title: '', organization: '', date: '', proof: null }}
        />
      </TabPanel>
    </Box>
  );
}
