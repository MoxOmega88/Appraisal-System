import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Description as DescriptionIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  EmojiEvents as EmojiEventsIcon,
  Work as WorkIcon,
  Groups as GroupsIcon,
  Gavel as GavelIcon,
  MenuBook as MenuBookIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { termService, zipService, pdfReportService } from '../services/api';
import axios from 'axios';

const DashboardNew = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingZip, setGeneratingZip] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    } catch (err) {
      setError('Failed to fetch terms');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const endpoints = [
        '/fci-scores',
        '/journal-papers',
        '/conference-papers',
        '/non-indexed-publications',
        '/books',
        '/disclosures',
        '/patents',
        '/ug-guidance',
        '/masters-guidance',
        '/phd-guidance',
        '/funded-projects',
        '/consulting-projects',
        '/reviewer-roles',
        '/fdp-organized',
        '/invited-talks',
        '/events-outside',
        '/events-inside',
        '/industry-relations',
        '/institutional-services',
        '/other-services',
        '/awards',
        '/professionalism',
        '/other-contributions'
      ];

      const results = await Promise.all(
        endpoints.map(endpoint => 
          axios.get(`/api${endpoint}?termId=${selectedTerm}`)
            .then(res => res.data.length)
            .catch(() => 0)
        )
      );

      setStats({
        fciScores: results[0],
        journalPapers: results[1],
        conferencePapers: results[2],
        nonIndexedPublications: results[3],
        books: results[4],
        disclosures: results[5],
        patents: results[6],
        ugGuidance: results[7],
        mastersGuidance: results[8],
        phdGuidance: results[9],
        fundedProjects: results[10],
        consultingProjects: results[11],
        reviewerRoles: results[12],
        fdpOrganized: results[13],
        invitedTalks: results[14],
        eventsOutside: results[15],
        eventsInside: results[16],
        industryRelations: results[17],
        institutionalServices: results[18],
        otherServices: results[19],
        awards: results[20],
        professionalism: results[21],
        otherContributions: results[22]
      });
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateZip = async () => {
    if (!selectedTerm) {
      setError('Please select a term');
      return;
    }

    setGeneratingZip(true);
    setError('');
    setSuccess('');

    try {
      const response = await zipService.generate(selectedTerm);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'Faculty_Files.zip';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('ZIP file with uploaded files downloaded successfully!');
    } catch (err) {
      setError('Failed to generate ZIP file. Please try again.');
      console.error('Error generating ZIP:', err);
    } finally {
      setGeneratingZip(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedTerm) {
      setError('Please select a term');
      return;
    }

    setGeneratingPdf(true);
    setError('');
    setSuccess('');

    try {
      const response = await pdfReportService.generate(selectedTerm);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'Faculty_Appraisal_Report.pdf';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('PDF report downloaded successfully!');
    } catch (err) {
      setError('Failed to generate PDF report. Please try again.');
      console.error('Error generating PDF:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const StatCard = ({ icon: Icon, title, count, color }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={color}>
              {count}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ fontSize: 40, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Faculty Appraisal Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your academic and research contributions
        </Typography>
      </Box>

      {/* Term Selection and Actions */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={generatingZip ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
              onClick={handleGenerateZip}
              disabled={!selectedTerm || generatingZip}
              sx={{ 
                py: 1.5,
                backgroundColor: '#1a237e',
                '&:hover': {
                  backgroundColor: '#0d1642'
                }
              }}
            >
              {generatingZip ? 'Generating...' : 'Download Files (ZIP)'}
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={generatingPdf ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
              onClick={handleGeneratePDF}
              disabled={!selectedTerm || generatingPdf}
              sx={{ 
                py: 1.5,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20'
                }
              }}
            >
              {generatingPdf ? 'Generating...' : 'Generate PDF Report'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      ) : stats ? (
        <Grid container spacing={3}>
          {/* Research Publications */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Research Publications
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={DescriptionIcon}
              title="Journal Papers"
              count={stats.journalPapers}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={DescriptionIcon}
              title="Conference Papers"
              count={stats.conferencePapers}
              color="#0288d1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={MenuBookIcon}
              title="Books/Chapters"
              count={stats.books}
              color="#01579b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={DescriptionIcon}
              title="Other Publications"
              count={stats.nonIndexedPublications}
              color="#0277bd"
            />
          </Grid>

          {/* Patents & IP */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Patents & Intellectual Property
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={GavelIcon}
              title="Patents"
              count={stats.patents}
              color="#f57c00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={GavelIcon}
              title="Disclosures"
              count={stats.disclosures}
              color="#ef6c00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={EmojiEventsIcon}
              title="Awards"
              count={stats.awards}
              color="#ffa726"
            />
          </Grid>

          {/* Research Guidance */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Research Guidance
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={SchoolIcon}
              title="PhD Guidance"
              count={stats.phdGuidance}
              color="#388e3c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={SchoolIcon}
              title="Masters Guidance"
              count={stats.mastersGuidance}
              color="#43a047"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={SchoolIcon}
              title="UG Guidance"
              count={stats.ugGuidance}
              color="#66bb6a"
            />
          </Grid>

          {/* Projects */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Projects & Collaborations
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={ScienceIcon}
              title="Funded Projects"
              count={stats.fundedProjects}
              color="#7b1fa2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={WorkIcon}
              title="Consulting Projects"
              count={stats.consultingProjects}
              color="#8e24aa"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={WorkIcon}
              title="Industry Relations"
              count={stats.industryRelations}
              color="#ab47bc"
            />
          </Grid>

          {/* Professional Activities */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Professional Activities
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={GroupsIcon}
              title="FDP Organized"
              count={stats.fdpOrganized}
              color="#c62828"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={GroupsIcon}
              title="Invited Talks"
              count={stats.invitedTalks}
              color="#d32f2f"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={GroupsIcon}
              title="Events Outside"
              count={stats.eventsOutside}
              color="#e53935"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={GroupsIcon}
              title="Events Inside"
              count={stats.eventsInside}
              color="#f44336"
            />
          </Grid>

          {/* Services */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Institutional Services
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={WorkIcon}
              title="Institutional Services"
              count={stats.institutionalServices}
              color="#00796b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={WorkIcon}
              title="Other Services"
              count={stats.otherServices}
              color="#00897b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={DescriptionIcon}
              title="Reviewer Roles"
              count={stats.reviewerRoles}
              color="#26a69a"
            />
          </Grid>

          {/* Teaching & Others */}
          <Grid item xs={12} mt={2}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Teaching & Others
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={SchoolIcon}
              title="FCI Score"
              count={stats.fciScores}
              color="#5d4037"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={EmojiEventsIcon}
              title="Professionalism"
              count={stats.professionalism}
              color="#6d4c41"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={DescriptionIcon}
              title="Other Contributions"
              count={stats.otherContributions}
              color="#795548"
            />
          </Grid>
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Select a term to view statistics
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default DashboardNew;
