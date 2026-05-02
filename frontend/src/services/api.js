/**
 * API Service
 * Centralized API calls for all modules
 */

import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = '/api';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    // Always return the full response for compatibility
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      const { data, status } = error.response;
      
      if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        // Clear token and redirect to login
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(error);
      } else if (status === 403) {
        errorMessage = 'Access denied';
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status === 500) {
        errorMessage = 'Server error occurred';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection and ensure the backend server is running.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#1976d2',
      customClass: {
        container: 'swal-high-zindex'
      }
    });

    return Promise.reject(error);
  }
);

// Generic CRUD operations factory
const createCRUDService = (endpoint) => ({
  getAll: (termId = null) => 
    axios.get(`${API_BASE}/${endpoint}${termId ? `?termId=${termId}` : ''}`),
  
  getById: (id) => 
    axios.get(`${API_BASE}/${endpoint}/${id}`),
  
  create: (data) => {
    if (data instanceof FormData) {
      return axios.post(`${API_BASE}/${endpoint}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axios.post(`${API_BASE}/${endpoint}`, data);
  },
  
  update: (id, data) => {
    if (data instanceof FormData) {
      return axios.put(`${API_BASE}/${endpoint}/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return axios.put(`${API_BASE}/${endpoint}/${id}`, data);
  },
  
  delete: (id) => 
    axios.delete(`${API_BASE}/${endpoint}/${id}`)
});

// API Services for all modules
export const termService = createCRUDService('terms');
export const fciScoreService = createCRUDService('fci-scores');
export const journalPaperService = createCRUDService('journal-papers');
export const conferencePaperService = createCRUDService('conference-papers');
export const nonIndexedPublicationService = createCRUDService('non-indexed-publications');
export const bookService = createCRUDService('books');
export const disclosureService = createCRUDService('disclosures');
export const patentService = createCRUDService('patents');
export const ugGuidanceService = createCRUDService('ug-guidance');
export const mastersGuidanceService = createCRUDService('masters-guidance');
export const phdGuidanceService = createCRUDService('phd-guidance');
export const fundedProjectService = createCRUDService('funded-projects');
export const consultingProjectService = createCRUDService('consulting-projects');
export const reviewerRoleService = createCRUDService('reviewer-roles');
export const fdpOrganizedService = createCRUDService('fdp-organized');
export const invitedTalkService = createCRUDService('invited-talks');
export const eventOutsideService = createCRUDService('events-outside');
export const eventInsideService = createCRUDService('events-inside');
export const industryRelationService = createCRUDService('industry-relations');
export const institutionalServiceService = createCRUDService('institutional-services');
export const otherServiceService = createCRUDService('other-services');
export const awardService = createCRUDService('awards');
export const professionalismService = createCRUDService('professionalism');
export const otherContributionService = createCRUDService('other-contributions');

// Report service
export const reportService = {
  generate: (termId) => 
    axios.get(`${API_BASE}/report/${termId}`, { responseType: 'blob' })
};

// Final report service (ZIP with PDF and files)
export const finalReportService = {
  generate: (termId) => 
    axios.get(`${API_BASE}/generate-final-report/${termId}`, { responseType: 'blob' })
};

// ZIP service (only files, no PDF) - with module selection
export const zipService = {
  generate: (termId, selectedFields = []) => 
    axios.post(`${API_BASE}/generate-zip/${termId}`, 
      { selectedFields }, 
      { responseType: 'blob' }
    )
};

// PDF report service (only PDF, no files)
export const pdfReportService = {
  generate: (termId) => 
    axios.get(`${API_BASE}/generate-pdf-report/${termId}`, { responseType: 'blob' })
};

// Data Summary service (comprehensive PDF with all database fields)
export const dataSummaryService = {
  generate: (termId, selectedFields = null) => 
    axios.post(`${API_BASE}/generate-data-summary/${termId}`, 
      { selectedFields }, 
      { responseType: 'blob' }
    )
};

// Default axios instance for direct API calls
const api = axios.create({
  baseURL: API_BASE
});

export default api;

// Mark which services accept proof uploads (frontend mirror of backend allow-list)
journalPaperService.proofAllowed = true;
conferencePaperService.proofAllowed = true;
bookService.proofAllowed = true;
patentService.proofAllowed = true;
fundedProjectService.proofAllowed = true;
awardService.proofAllowed = true;
eventInsideService.proofAllowed = true;
eventOutsideService.proofAllowed = true;
otherServiceService.proofAllowed = true; // Other Services to Institution or Society
industryRelationService.proofAllowed = true;