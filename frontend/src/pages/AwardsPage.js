/**
 * Awards Page
 * Awards, professionalism, and other contributions
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { awardService, professionalismService, otherContributionService } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function AwardsPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Awards & Recognition
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Awards, professionalism rating, and other major contributions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Awards & Honours" />
          <Tab label="Professionalism" />
          <Tab label="Other Contributions" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericCRUDPage
          title=""
          description=""
          service={awardService}
          columns={[
            { field: 'title', header: 'Award Title' },
            { field: 'issuingBody', header: 'Issuing Body' },
            { field: 'date', header: 'Date', render: (val) => new Date(val).toLocaleDateString() },
            { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
          ]}
          formFields={[
            { name: 'title', label: 'Award Title', required: true, fullWidth: true },
            { name: 'issuingBody', label: 'Issuing Body', required: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
          ]}
          initialFormData={{ title: '', issuingBody: '', date: '', proof: null }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={professionalismService}
          columns={[
            { field: 'rating', header: 'Rating (1-5)' },
            { field: 'remarks', header: 'Remarks' },
          ]}
          formFields={[
            { name: 'rating', label: 'Professionalism Rating (1-5)', type: 'number', required: true, inputProps: { min: 1, max: 5 } },
            { name: 'remarks', label: 'Remarks', fullWidth: true, multiline: true, rows: 4 },
          ]}
          initialFormData={{ rating: '', remarks: '' }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GenericCRUDPage
          title=""
          description=""
          service={otherContributionService}
          columns={[
            { field: 'description', header: 'Description' },
          ]}
          formFields={[
            { name: 'description', label: 'Contribution Description (Max 500 characters)', required: true, fullWidth: true, multiline: true, rows: 5, inputProps: { maxLength: 500 } },
          ]}
          initialFormData={{ description: '' }}
        />
      </TabPanel>
    </Box>
  );
}
