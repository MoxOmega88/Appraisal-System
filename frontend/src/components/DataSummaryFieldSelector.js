import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import {
  School as SchoolIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Groups as GroupsIcon,
  Science as ScienceIcon,
  Work as WorkIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

const DataSummaryFieldSelector = ({ open, onClose, onGenerate }) => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Module configuration matching backend
  const modules = [
    {
      section: 'Teaching & Academics',
      icon: SchoolIcon,
      color: '#6d4c41',
      fields: [
        { key: 'fciScores', label: 'FCI Score' }
      ]
    },
    {
      section: 'Research Publications',
      icon: DescriptionIcon,
      color: '#1976d2',
      fields: [
        { key: 'journalPapers', label: 'Journal Papers' },
        { key: 'conferencePapers', label: 'Conference Papers' },
        { key: 'nonIndexedPublications', label: 'Non-Indexed Publications' },
        { key: 'books', label: 'Books / Book Chapters' }
      ]
    },
    {
      section: 'Intellectual Property',
      icon: GavelIcon,
      color: '#ff6f00',
      fields: [
        { key: 'disclosures', label: 'Disclosures Filed' },
        { key: 'patents', label: 'Patents Granted' }
      ]
    },
    {
      section: 'Research Guidance',
      icon: SchoolIcon,
      color: '#43a047',
      fields: [
        { key: 'ugGuidance', label: 'UG Research Guidance' },
        { key: 'mastersGuidance', label: "Master's Research Guidance" },
        { key: 'phdGuidance', label: 'PhD Research Guidance' }
      ]
    },
    {
      section: 'Projects',
      icon: ScienceIcon,
      color: '#7b1fa2',
      fields: [
        { key: 'fundedProjects', label: 'Funded Projects' },
        { key: 'consultingProjects', label: 'Consulting Projects' }
      ]
    },
    {
      section: 'Professional Activities',
      icon: GroupsIcon,
      color: '#00897b',
      fields: [
        { key: 'reviewerRoles', label: 'Reviewer Roles' },
        { key: 'fdpOrganized', label: 'FDP/Events Organized' }
      ]
    },
    {
      section: 'Lectures & Events',
      icon: GroupsIcon,
      color: '#d32f2f',
      fields: [
        { key: 'invitedTalks', label: 'Invited Talks' },
        { key: 'eventsOutside', label: 'Events Outside Institute' },
        { key: 'eventsInside', label: 'Events Inside Institute' }
      ]
    },
    {
      section: 'Relations & Services',
      icon: WorkIcon,
      color: '#5e35b1',
      fields: [
        { key: 'industryRelations', label: 'Industry Relations' },
        { key: 'institutionalServices', label: 'Institutional Services' },
        { key: 'otherServices', label: 'Other Services' }
      ]
    },
    {
      section: 'Recognition',
      icon: EmojiEventsIcon,
      color: '#ff9800',
      fields: [
        { key: 'awards', label: 'Awards & Honours' },
        { key: 'professionalism', label: 'Professionalism / Team Spirit' },
        { key: 'otherContributions', label: 'Other Major Contributions' }
      ]
    }
  ];

  const allFieldKeys = modules.flatMap(section => section.fields.map(f => f.key));

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedFields(allFieldKeys);
    } else {
      setSelectedFields([]);
    }
  };

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields(prev => {
      const newSelection = prev.includes(fieldKey)
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey];
      
      setSelectAll(newSelection.length === allFieldKeys.length);
      return newSelection;
    });
  };

  const handleGenerate = () => {
    if (selectedFields.length === 0 && !selectAll) {
      alert('Please select at least one module');
      return;
    }
    onGenerate(selectAll ? [] : selectedFields);
  };

  const handleClose = () => {
    setSelectedFields([]);
    setSelectAll(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1, backgroundColor: '#ed6c02', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          Select Modules for Data Summary Report
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
          Choose which modules to include in the PDF report
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#fff3e0',
            border: '1px solid #ed6c02'
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                sx={{ 
                  color: '#ed6c02',
                  '&.Mui-checked': { color: '#ed6c02' }
                }}
              />
            }
            label={
              <Typography variant="body1" fontWeight="600" color="#e65100">
                Select All Modules
              </Typography>
            }
          />
        </Paper>

        {modules.map((section, idx) => {
          const SectionIcon = section.icon;
          return (
            <Box key={idx} sx={{ mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 1.5,
                  pb: 1,
                  borderBottom: `2px solid ${section.color}30`
                }}
              >
                <SectionIcon sx={{ color: section.color, fontSize: 22 }} />
                <Typography 
                  variant="subtitle1" 
                  fontWeight="700"
                  sx={{ color: section.color }}
                >
                  {section.section}
                </Typography>
              </Box>
              
              <FormGroup sx={{ pl: 4 }}>
                {section.fields.map((field) => (
                  <FormControlLabel
                    key={field.key}
                    control={
                      <Checkbox
                        checked={selectedFields.includes(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {field.label}
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          );
        })}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate}
          variant="contained"
          sx={{ 
            minWidth: 150,
            backgroundColor: '#ed6c02',
            '&:hover': {
              backgroundColor: '#e65100'
            }
          }}
        >
          Generate PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataSummaryFieldSelector;
