/**
 * API Service
 * Centralized API calls for all modules
 */

import axios from 'axios';

const API_BASE = '/api';

// Generic CRUD operations factory
const createCRUDService = (endpoint) => ({
  getAll: (termId = null) => 
    axios.get(`${API_BASE}/${endpoint}${termId ? `?termId=${termId}` : ''}`),
  
  getById: (id) => 
    axios.get(`${API_BASE}/${endpoint}/${id}`),
  
  create: (data) => 
    axios.post(`${API_BASE}/${endpoint}`, data),
  
  update: (id, data) => 
    axios.put(`${API_BASE}/${endpoint}/${id}`, data),
  
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