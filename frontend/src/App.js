/**
 * Main App Component
 * Routing and theme configuration
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/authContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardNew from './pages/DashboardNew';
import TermManagement from './pages/TermManagement';
import JournalPapersPageNew from './pages/JournalPapersPageNew';
import {
  ConferencePapersPageNew,
  PatentsPageNew,
  AwardsPageNew,
  BooksPageNew,
  DisclosuresPageNew,
  NonIndexedPublicationsPageNew,
  FCIScorePageNew,
  UGGuidancePageNew,
  MastersGuidancePageNew,
  PhDGuidancePageNew,
  FundedProjectsPageNew,
  ConsultingProjectsPageNew,
  ReviewerRolesPageNew,
  FDPOrganizedPageNew,
  InvitedTalksPageNew,
  EventsOutsidePageNew,
  EventsInsidePageNew,
  IndustryRelationsPageNew,
  InstitutionalServicesPageNew,
  OtherServicesPageNew,
  ProfessionalismPageNew,
  OtherContributionsPageNew
} from './pages/UniversalModulePage';

// Layout
import Layout from './components/Layout';

// Professional academic theme with serif fonts
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#2c5282',
      dark: '#0f2540',
    },
    secondary: {
      main: '#744210',
      light: '#975a16',
      dark: '#5a330c',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardNew />} />
        <Route path="terms" element={<TermManagement />} />
        <Route path="fci-scores" element={<FCIScorePageNew />} />
        <Route path="journal-papers" element={<JournalPapersPageNew />} />
        <Route path="conference-papers" element={<ConferencePapersPageNew />} />
        <Route path="non-indexed-publications" element={<NonIndexedPublicationsPageNew />} />
        <Route path="books" element={<BooksPageNew />} />
        <Route path="disclosures" element={<DisclosuresPageNew />} />
        <Route path="patents" element={<PatentsPageNew />} />
        <Route path="ug-guidance" element={<UGGuidancePageNew />} />
        <Route path="masters-guidance" element={<MastersGuidancePageNew />} />
        <Route path="phd-guidance" element={<PhDGuidancePageNew />} />
        <Route path="funded-projects" element={<FundedProjectsPageNew />} />
        <Route path="consulting-projects" element={<ConsultingProjectsPageNew />} />
        <Route path="reviewer-roles" element={<ReviewerRolesPageNew />} />
        <Route path="fdp-organized" element={<FDPOrganizedPageNew />} />
        <Route path="invited-talks" element={<InvitedTalksPageNew />} />
        <Route path="events-outside" element={<EventsOutsidePageNew />} />
        <Route path="events-inside" element={<EventsInsidePageNew />} />
        <Route path="industry-relations" element={<IndustryRelationsPageNew />} />
        <Route path="institutional-services" element={<InstitutionalServicesPageNew />} />
        <Route path="other-services" element={<OtherServicesPageNew />} />
        <Route path="professionalism" element={<ProfessionalismPageNew />} />
        <Route path="other-contributions" element={<OtherContributionsPageNew />} />
        <Route path="awards" element={<AwardsPageNew />} />
        
        {/* Legacy grouped routes */}
        <Route path="research-guidance" element={<UGGuidancePageNew />} />
        <Route path="projects" element={<FundedProjectsPageNew />} />
        <Route path="professional-activities" element={<ReviewerRolesPageNew />} />
        <Route path="events" element={<EventsInsidePageNew />} />
        <Route path="services" element={<InstitutionalServicesPageNew />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;