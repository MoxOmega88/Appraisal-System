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
import Dashboard from './pages/Dashboard';
import TermManagement from './pages/TermManagement';
import FCIScorePage from './pages/FCIScorePage';
import JournalPapersPage from './pages/JournalPapersPage';
import ConferencePapersPage from './pages/ConferencePapersPage';
import NonIndexedPublicationsPage from './pages/NonIndexedPublicationsPage';
import BooksPage from './pages/BooksPage';
import DisclosuresPage from './pages/DisclosuresPage';
import PatentsPage from './pages/PatentsPage';
import ResearchGuidancePage from './pages/ResearchGuidancePage';
import ProjectsPage from './pages/ProjectsPage';
import ProfessionalActivitiesPage from './pages/ProfessionalActivitiesPage';
import EventsPage from './pages/EventsPage';
import ServicesPage from './pages/ServicesPage';
import AwardsPage from './pages/AwardsPage';

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
        <Route index element={<Dashboard />} />
        <Route path="terms" element={<TermManagement />} />
        <Route path="fci-scores" element={<FCIScorePage />} />
        <Route path="journal-papers" element={<JournalPapersPage />} />
        <Route path="conference-papers" element={<ConferencePapersPage />} />
        <Route path="non-indexed-publications" element={<NonIndexedPublicationsPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="disclosures" element={<DisclosuresPage />} />
        <Route path="patents" element={<PatentsPage />} />
        <Route path="research-guidance" element={<ResearchGuidancePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="professional-activities" element={<ProfessionalActivitiesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="awards" element={<AwardsPage />} />
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