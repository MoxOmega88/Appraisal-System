/**
 * Professional Activities Page
 * Reviewer roles, FDP organized, and invited talks
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Chip } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { reviewerRoleService, fdpOrganizedService, invitedTalkService } from '../services/api';

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
        <GenericCRUDPage
          title=""
          description=""
          service={reviewerRoleService}
          columns={[
            { field: 'roleType', header: 'Role Type' },
            { field: 'venueName', header: 'Venue Name' },
            { field: 'year', header: 'Year' },
            { field: 'isQ1Q2Reviewer', header: 'Q1/Q2 Reviewer', render: (val) => val ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" size="small" /> },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'roleType', label: 'Role Type', type: 'select', required: true, options: ['Conference Chair', 'Session Chair', 'Reviewer'] },
            { name: 'venueName', label: 'Venue Name (Journal/Conference)' },
            { name: 'year', label: 'Year', type: 'number', inputProps: { min: 1900, max: 2100 } },
            { name: 'isQ1Q2Reviewer', label: 'Q1/Q2 Journal Reviewer', type: 'select', options: [false, true] },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ roleType: '', venueName: '', year: '', isQ1Q2Reviewer: false, proof: null }}
        />
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
