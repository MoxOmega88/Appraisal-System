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
import { termService, zipService, pdfReportService, dataSummaryService } from '../services/api';
import DataSummaryFieldSelector from '../components/DataSummaryFieldSelector';
import ZipFieldSelector from '../components/ZipFieldSelector';
import axios from 'axios';

const DashboardNew = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingZip, setGeneratingZip] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [generatingDataSummary, setGeneratingDataSummary] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldSelectorOpen, setFieldSelectorOpen] = useState(false);
  const [zipSelectorOpen, setZipSelectorOpen] = useState(false);

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
      const termsData = response.data?.data || response.data || [];
      setTerms(termsData);
      if (termsData.length > 0) {
        setSelectedTerm(termsData[0]._id);
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
        endpoints.map((endpoint, index) => 
          axios.get(`/api${endpoint}?termId=${selectedTerm}`)
            .then(res => {
              // Handle both structured { success, data } and legacy array responses
              const data = res.data?.data || res.data || [];
              
              // Special handling for FCI Scores - calculate average (already 0-100)
              if (index === 0 && Array.isArray(data) && data.length > 0) {
                const totalScore = data.reduce((sum, item) => sum + (item.averageScore || 0), 0);
                const avgScore = totalScore / data.length;
                return Math.round(avgScore);
              }
              
              return Array.isArray(data) ? data.length : 0;
            })
            .catch(() => index === 0 ? 0 : 0) // Return 0 for FCI score if error
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

  const handleGenerateZip = async (selectedFields) => {
    if (!selectedTerm) {
      setError('Please select a term');
      return;
    }

    setGeneratingZip(true);
    setError('');
    setSuccess('');
    setZipSelectorOpen(false);

    try {
      const response = await zipService.generate(selectedTerm, selectedFields);

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

  const handleGenerateDataSummary = async (selectedFields) => {
    if (!selectedTerm) {
      setError('Please select a term');
      return;
    }

    setGeneratingDataSummary(true);
    setError('');
    setSuccess('');
    setFieldSelectorOpen(false);

    try {
      const response = await dataSummaryService.generate(selectedTerm, selectedFields);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'Faculty_Data_Summary.pdf';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Data summary report downloaded successfully!');
    } catch (err) {
      setError('Failed to generate data summary. Please try again.');
      console.error('Error generating data summary:', err);
    } finally {
      setGeneratingDataSummary(false);
    }
  };

  const StatCard = ({ icon: Icon, title, count, color, gradient }) => (
    <Card 
      sx={{ 
        height: '100%',
        background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${color}25`,
          border: `1px solid ${color}60`,
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                backgroundColor: color,
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${color}40`
              }}
            >
              <Icon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              sx={{ 
                color: color,
                textShadow: `0 2px 4px ${color}20`
              }}
            >
              {count}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '0.875rem',
              lineHeight: 1.3
            }}
          >
            {title}
          </Typography>
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={generatingZip ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
              onClick={() => setZipSelectorOpen(true)}
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
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={generatingDataSummary ? <CircularProgress size={20} color="inherit" /> : <MenuBookIcon />}
              onClick={() => setFieldSelectorOpen(true)}
              disabled={!selectedTerm || generatingDataSummary}
              sx={{ 
                py: 1.5,
                backgroundColor: '#ed6c02',
                '&:hover': {
                  backgroundColor: '#e65100'
                }
              }}
            >
              {generatingDataSummary ? 'Generating...' : 'Data Summary Report'}
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
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
        <>
          {/* SECTION 1: TEACHING & ACADEMICS */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #8d6e63 0%, #8d6e6330 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#5d4037',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                📚 Teaching & Academics
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={SchoolIcon}
                  title="FCI Score"
                  count={stats.fciScores}
                  color="#6d4c41"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 2: RESEARCH & PUBLICATIONS */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #1976d2 0%, #1976d230 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#1565c0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                📄 Research & Publications
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={DescriptionIcon}
                  title="Journal Papers"
                  count={stats.journalPapers}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={DescriptionIcon}
                  title="Conference Papers"
                  count={stats.conferencePapers}
                  color="#1e88e5"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={DescriptionIcon}
                  title="Non-Indexed Publications"
                  count={stats.nonIndexedPublications}
                  color="#42a5f5"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={MenuBookIcon}
                  title="Books / Chapters"
                  count={stats.books}
                  color="#0d47a1"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GavelIcon}
                  title="Disclosures Filed"
                  count={stats.disclosures}
                  color="#ff6f00"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GavelIcon}
                  title="Patents Granted"
                  count={stats.patents}
                  color="#ff8f00"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 3: RESEARCH GUIDANCE */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #43a047 0%, #43a04730 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#2e7d32',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                🎓 Research Guidance
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={SchoolIcon}
                  title="UG Guidance"
                  count={stats.ugGuidance}
                  color="#66bb6a"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={SchoolIcon}
                  title="Master's Guidance"
                  count={stats.mastersGuidance}
                  color="#43a047"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={SchoolIcon}
                  title="PhD Guidance"
                  count={stats.phdGuidance}
                  color="#2e7d32"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 4: PROJECTS & CONSULTING */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #8e24aa 0%, #8e24aa30 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#6a1b9a',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                💼 Projects & Consulting
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={ScienceIcon}
                  title="Funded Projects"
                  count={stats.fundedProjects}
                  color="#7b1fa2"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={WorkIcon}
                  title="Consulting Projects"
                  count={stats.consultingProjects}
                  color="#9c27b0"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 5: PROFESSIONAL ACTIVITIES */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #00897b 0%, #00897b30 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#00695c',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                🏢 Professional Activities
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={DescriptionIcon}
                  title="Conference/Reviewer Roles"
                  count={stats.reviewerRoles}
                  color="#00897b"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GroupsIcon}
                  title="FDP / Events Organized"
                  count={stats.fdpOrganized}
                  color="#26a69a"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 6: LECTURES & EVENTS */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #e53935 0%, #e5393530 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#c62828',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                🎤 Lectures & Events
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GroupsIcon}
                  title="Invited Talks Outside"
                  count={stats.invitedTalks}
                  color="#d32f2f"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GroupsIcon}
                  title="Events Outside Institute"
                  count={stats.eventsOutside}
                  color="#e53935"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={GroupsIcon}
                  title="Events Inside Institute"
                  count={stats.eventsInside}
                  color="#f44336"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 7: RELATIONS & SERVICES */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #5e35b1 0%, #5e35b130 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#4527a0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                🤝 Relations & Services
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={WorkIcon}
                  title="Industry Relations"
                  count={stats.industryRelations}
                  color="#5e35b1"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={WorkIcon}
                  title="Institutional Services"
                  count={stats.institutionalServices}
                  color="#673ab7"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={WorkIcon}
                  title="Other Services"
                  count={stats.otherServices}
                  color="#7e57c2"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECTION 8: RECOGNITION */}
          <Box mb={4}>
            <Box 
              sx={{ 
                mb: 3,
                pb: 1,
                borderBottom: '3px solid',
                borderImage: 'linear-gradient(90deg, #ff9800 0%, #ff980030 100%) 1',
                display: 'inline-block'
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ 
                  color: '#f57c00',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.95rem'
                }}
              >
                🏆 Recognition
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={EmojiEventsIcon}
                  title="Awards & Honours"
                  count={stats.awards}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={EmojiEventsIcon}
                  title="Professionalism / Team Spirit"
                  count={stats.professionalism}
                  color="#fb8c00"
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <StatCard
                  icon={DescriptionIcon}
                  title="Other Major Contributions"
                  count={stats.otherContributions}
                  color="#f57c00"
                />
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Select a term to view statistics
          </Typography>
        </Box>
      )}

      {/* Field Selector Modal */}
      <DataSummaryFieldSelector
        open={fieldSelectorOpen}
        onClose={() => setFieldSelectorOpen(false)}
        onGenerate={handleGenerateDataSummary}
      />

      {/* ZIP Selector Modal */}
      <ZipFieldSelector
        open={zipSelectorOpen}
        onClose={() => setZipSelectorOpen(false)}
        onGenerate={handleGenerateZip}
      />
    </Container>
  );
};

export default DashboardNew;
