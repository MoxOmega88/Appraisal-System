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
          ]}
          formFields={[
            { name: 'type', label: 'Type', type: 'select', required: true, options: ['MoU', 'Co-hosted Event', 'Technical Talk Series'] },
            { name: 'companyName', label: 'Company Name', required: true },
            { name: 'description', label: 'Description', fullWidth: true, multiline: true, rows: 3 },
            { name: 'date', label: 'Date', type: 'date', required: true },
          ]}
          initialFormData={{ type: '', companyName: '', description: '', date: '' }}
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
          ]}
          formFields={[
            { name: 'role', label: 'Role', type: 'select', required: true, options: ['Coordinator', 'Others'] },
            { name: 'serviceName', label: 'Service Name (e.g., NBA, NIRF)', required: true },
            { name: 'description', label: 'Description', fullWidth: true, multiline: true, rows: 3 },
          ]}
          initialFormData={{ role: '', serviceName: '', description: '' }}
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
          ]}
          formFields={[
            { name: 'description', label: 'Service Description', required: true, fullWidth: true, multiline: true, rows: 4 },
            { name: 'date', label: 'Date', type: 'date' },
          ]}
          initialFormData={{ description: '', date: '' }}
        />
      </TabPanel>
    </Box>
  );
}
