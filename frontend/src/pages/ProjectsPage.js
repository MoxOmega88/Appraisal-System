/**
 * Projects Page
 * Combined page for Funded and Consulting Projects
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { fundedProjectService, consultingProjectService } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ProjectsPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Projects
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage funded and consulting projects
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Funded Projects" />
          <Tab label="Consulting Projects" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericCRUDPage
          title=""
          description=""
          service={fundedProjectService}
          columns={[
            { field: 'title', header: 'Title' },
            { field: 'fundingAmount', header: 'Funding Amount (₹)', render: (val) => `₹${val.toLocaleString()}` },
            { field: 'category', header: 'Category' },
            { field: 'fundingAgency', header: 'Funding Agency' },
          ]}
          formFields={[
            { name: 'title', label: 'Project Title', required: true, fullWidth: true },
            { name: 'fundingAmount', label: 'Funding Amount (₹)', type: 'number', required: true, inputProps: { min: 0 } },
            { name: 'category', label: 'Category', type: 'select', required: true, options: ['≥10 Lakhs', '5-10 Lakhs', '1-5 Lakhs', '<1 Lakh'] },
            { name: 'fundingAgency', label: 'Funding Agency' },
            { name: 'startDate', label: 'Start Date', type: 'date' },
            { name: 'endDate', label: 'End Date', type: 'date' },
          ]}
          initialFormData={{ title: '', fundingAmount: '', category: '', fundingAgency: '', startDate: '', endDate: '' }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={consultingProjectService}
          columns={[
            { field: 'title', header: 'Title' },
            { field: 'amount', header: 'Amount (₹)', render: (val) => `₹${val.toLocaleString()}` },
            { field: 'clientName', header: 'Client Name' },
            { field: 'completionDate', header: 'Completion Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
          ]}
          formFields={[
            { name: 'title', label: 'Project Title', required: true, fullWidth: true },
            { name: 'amount', label: 'Amount (₹)', type: 'number', required: true, inputProps: { min: 0 } },
            { name: 'clientName', label: 'Client Name' },
            { name: 'completionDate', label: 'Completion Date', type: 'date' },
          ]}
          initialFormData={{ title: '', amount: '', clientName: '', completionDate: '' }}
        />
      </TabPanel>
    </Box>
  );
}
