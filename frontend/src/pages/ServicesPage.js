/**
 * Services Page
 * Industry relations, institutional services, and other services
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { industryRelationService, institutionalServiceService, otherServiceService } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ServicesPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Services
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Industry relations, institutional services, and other contributions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Industry Relations" />
          <Tab label="Institutional Services" />
          <Tab label="Other Services" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericCRUDPage
          title=""
          description=""
          service={industryRelationService}
          columns={[
            { field: 'type', header: 'Type' },
            { field: 'companyName', header: 'Company Name' },
            { field: 'description', header: 'Description' },
            { field: 'date', header: 'Date', render: (val) => new Date(val).toLocaleDateString() },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'type', label: 'Type', type: 'select', required: true, options: ['MoU', 'Co-hosted Event', 'Technical Talk Series'] },
            { name: 'companyName', label: 'Company Name', required: true },
            { name: 'description', label: 'Description', fullWidth: true, multiline: true, rows: 3 },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ type: '', companyName: '', description: '', date: '', proof: null }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={institutionalServiceService}
          columns={[
            { field: 'role', header: 'Role' },
            { field: 'serviceName', header: 'Service Name' },
            { field: 'description', header: 'Description' },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'role', label: 'Role', type: 'select', required: true, options: ['Coordinator', 'Others'] },
            { name: 'serviceName', label: 'Service Name (e.g., NBA, NIRF)', required: true },
            { name: 'description', label: 'Description', fullWidth: true, multiline: true, rows: 3 },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ role: '', serviceName: '', description: '', proof: null }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GenericCRUDPage
          title=""
          description=""
          service={otherServiceService}
          columns={[
            { field: 'description', header: 'Description' },
            { field: 'date', header: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'description', label: 'Service Description', required: true, fullWidth: true, multiline: true, rows: 4 },
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ description: '', date: '', proof: null }}
        />
      </TabPanel>
    </Box>
  );
}
