/**
 * Events Page
 * Events participated inside and outside institute
 */

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { eventOutsideService, eventInsideService } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function EventsPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Events Participated
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Events participated inside and outside the institute
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Outside Institute" />
          <Tab label="Inside Institute" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericCRUDPage
          title=""
          description=""
          service={eventOutsideService}
          columns={[
            { field: 'type', header: 'Type' },
            { field: 'eventName', header: 'Event Name' },
            { field: 'organization', header: 'Organization' },
            { field: 'date', header: 'Date', render: (val) => new Date(val).toLocaleDateString() },
          ]}
          formFields={[
            { name: 'type', label: 'Event Type', type: 'select', required: true, options: ['FDP', 'Seminar', 'Workshop', 'Conference'] },
            { name: 'eventName', label: 'Event Name', required: true, fullWidth: true },
            { name: 'organization', label: 'Organization' },
            { name: 'date', label: 'Date', type: 'date', required: true },
          ]}
          initialFormData={{ type: '', eventName: '', organization: '', date: '' }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericCRUDPage
          title=""
          description=""
          service={eventInsideService}
          columns={[
            { field: 'type', header: 'Type' },
            { field: 'eventName', header: 'Event Name' },
            { field: 'date', header: 'Date', render: (val) => new Date(val).toLocaleDateString() },
          ]}
          formFields={[
            { name: 'type', label: 'Event Type', type: 'select', required: true, options: ['FDP', 'Seminar', 'Workshop', 'Conference', 'Meeting'] },
            { name: 'eventName', label: 'Event Name', required: true, fullWidth: true },
            { name: 'date', label: 'Date', type: 'date', required: true },
          ]}
          initialFormData={{ type: '', eventName: '', date: '' }}
        />
      </TabPanel>
    </Box>
  );
}
