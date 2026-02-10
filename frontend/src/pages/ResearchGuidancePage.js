/**
 * Research Guidance Page
 * Combined page for UG, Masters, and PhD guidance
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { ugGuidanceService, mastersGuidanceService, phdGuidanceService } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ResearchGuidancePage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Research Guidance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage research guidance for UG, Master's, and PhD students
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Undergraduate" />
          <Tab label="Master's" />
          <Tab label="PhD" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericCRUDPage
          title=""
          description=""
          service={ugGuidanceService}
          columns={[
            { field: 'numberOfStudents', header: 'Number of Students' },
            { field: 'projectTitle', header: 'Project Title' },
            { field: 'remarks', header: 'Remarks' },
          ]}
          formFields={[
            { name: 'numberOfStudents', label: 'Number of Students', type: 'number', required: true, inputProps: { min: 0 } },
            { name: 'projectTitle', label: 'Project Title', fullWidth: true },
            { name: 'remarks', label: 'Remarks', fullWidth: true, multiline: true, rows: 3 },
          ]}
          initialFormData={{ numberOfStudents: '', projectTitle: '', remarks: '' }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={mastersGuidanceService}
          columns={[
            { field: 'numberOfStudents', header: 'Number of Students' },
            { field: 'thesisTitle', header: 'Thesis Title' },
            { field: 'remarks', header: 'Remarks' },
          ]}
          formFields={[
            { name: 'numberOfStudents', label: 'Number of Students', type: 'number', required: true, inputProps: { min: 0 } },
            { name: 'thesisTitle', label: 'Thesis Title', fullWidth: true },
            { name: 'remarks', label: 'Remarks', fullWidth: true, multiline: true, rows: 3 },
          ]}
          initialFormData={{ numberOfStudents: '', thesisTitle: '', remarks: '' }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GenericCRUDPage
          title=""
          description=""
          service={phdGuidanceService}
          columns={[
            { field: 'numberOfScholars', header: 'Number of Scholars' },
            { field: 'scholarName', header: 'Scholar Name' },
            { field: 'researchArea', header: 'Research Area' },
            { field: 'status', header: 'Status' },
          ]}
          formFields={[
            { name: 'numberOfScholars', label: 'Number of Scholars', type: 'number', required: true, inputProps: { min: 0 } },
            { name: 'scholarName', label: 'Scholar Name' },
            { name: 'researchArea', label: 'Research Area', fullWidth: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'Submitted'] },
          ]}
          initialFormData={{ numberOfScholars: '', scholarName: '', researchArea: '', status: 'Ongoing' }}
        />
      </TabPanel>
    </Box>
  );
}
