/**
 * Dashboard Page
 * Overview of appraisal activities
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent,
  MenuItem, Select, FormControl, InputLabel, Button
} from '@mui/material';
import {
  MenuBook, Science, School, Work, EmojiEvents,
  PictureAsPdf
} from '@mui/icons-material';
import { useAuth } from '../context/authContext';
import {
  termService, journalPaperService, conferencePaperService,
  phdGuidanceService, fundedProjectService, awardService,
  reportService
} from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          bgcolor: color,
          color: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        {icon}
      </Box>
      <Box sx={{ pt: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [stats, setStats] = useState({
    journals: 0,
    conferences: 0,
    phdScholars: 0,
    projects: 0,
    awards: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchStats();
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await termService.getAll();
      setTerms(response.data);
      if (response.data.length > 0) {
        setSelectedTerm(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch terms:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [journals, conferences, phd, projects, awards] = await Promise.all([
        journalPaperService.getAll(selectedTerm),
        conferencePaperService.getAll(selectedTerm),
        phdGuidanceService.getAll(selectedTerm),
        fundedProjectService.getAll(selectedTerm),
        awardService.getAll(selectedTerm)
      ]);

      setStats({
        journals: journals.data.length,
        conferences: conferences.data.length,
        phdScholars: phd.data.reduce((sum, g) => sum + g.numberOfScholars, 0),
        projects: projects.data.length,
        awards: awards.data.length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedTerm) {
      alert('Please select a term');
      return;
    }

    setLoading(true);
    try {
      const response = await reportService.generate(selectedTerm);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appraisal-report-${selectedTerm}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontFamily: 'Merriweather' }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Term</InputLabel>
              <Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Select Term"
              >
                {terms.map((term) => (
                  <MenuItem key={term._id} value={term._id}>
                    {term.termName} ({term.academicYear})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={handleGenerateReport}
              disabled={!selectedTerm || loading}
              fullWidth
            >
              {loading ? 'Generating...' : 'Generate PDF Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Journal Papers"
            value={stats.journals}
            icon={<Science fontSize="large" />}
            color="#2c5282"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Conference Papers"
            value={stats.conferences}
            icon={<MenuBook fontSize="large" />}
            color="#744210"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="PhD Scholars"
            value={stats.phdScholars}
            icon={<School fontSize="large" />}
            color="#2d3748"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Funded Projects"
            value={stats.projects}
            icon={<Work fontSize="large" />}
            color="#276749"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Awards & Honors"
            value={stats.awards}
            icon={<EmojiEvents fontSize="large" />}
            color="#975a16"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar navigation to manage your appraisal records across all categories.
          Select a term above to view and download your comprehensive appraisal report.
        </Typography>
      </Paper>
    </Box>
  );
}