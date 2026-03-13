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
    // For successful responses, return the data directly
    if (response.data && response.data.success !== undefined) {
      return response.data; // Return structured response
    }
    return response; // Return original response for backward compatibility
  },
  (error) => {
    // Handle different types of errors
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      
      if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 404) {
        errorMessage = 'Resource not found';
      } else if (status === 403) {
        errorMessage = 'Access denied';
      } else if (status === 500) {
        errorMessage = 'Server error occurred';
      }
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      errorMessage = 'Request timeout. Please try again.';
    }

    // Show error popup
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#1976d2'
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
    // Validate required fields before sending
    if (endpoint.includes('guidance') || endpoint === 'reviewer-roles') {
      if (endpoint === 'ug-guidance' || endpoint === 'masters-guidance') {
        if (!data.get || (!data.numberOfStudents && data.numberOfStudents !== 0)) {
          if (data instanceof FormData) {
            if (!data.get('numberOfStudents')) {
              Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Number of students is required'
              });
              return Promise.reject(new Error('Number of students is required'));
            }
          }
        }
      }
      
      if (endpoint === 'phd-guidance') {
        if (data instanceof FormData) {
          if (!data.get('numberOfScholars')) {
            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: 'Number of scholars is required'
            });
            return Promise.reject(new Error('Number of scholars is required'));
          }
          if (!data.get('status')) {
            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: 'Status is required'
            });
            return Promise.reject(new Error('Status is required'));
          }
        }
      }
      
      if (endpoint === 'reviewer-roles') {
        if (data instanceof FormData) {
          if (!data.get('roleType')) {
            Swal.fire({
              icon: 'error',
              title: 'Validation Error',
              text: 'Role type is required'
            });
            return Promise.reject(new Error('Role type is required'));
          }
        }
      }
    }

    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      return axios.post(`${API_BASE}/${endpoint}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // You can add a progress indicator here if needed
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      }).then(response => {
        // Show success message for file uploads
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Record created successfully with file upload',
          timer: 2000,
          showConfirmButton: false
        });
        return response;
      });
    }
    
    return axios.post(`${API_BASE}/${endpoint}`, data).then(response => {
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Record created successfully',
        timer: 2000,
        showConfirmButton: false
      });
      return response;
    });
  },
  
  update: (id, data) => {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      return axios.put(`${API_BASE}/${endpoint}/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      }).then(response => {
        // Show success message for file uploads
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Record updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        return response;
      });
    }
    
    return axios.put(`${API_BASE}/${endpoint}/${id}`, data).then(response => {
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Record updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      return response;
    });
  },
  
  delete: (id) => 
    axios.delete(`${API_BASE}/${endpoint}/${id}`).then(response => {
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Record deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
      return response;
    })
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

// ZIP service (only files, no PDF)
export const zipService = {
  generate: (termId) => 
    axios.get(`${API_BASE}/generate-zip/${termId}`, { responseType: 'blob' })
};

// PDF report service (only PDF, no files)
export const pdfReportService = {
  generate: (termId) => 
    axios.get(`${API_BASE}/generate-pdf-report/${termId}`, { responseType: 'blob' })
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