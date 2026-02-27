import React from 'react';
import GenericCRUDPageWithUpload from '../components/GenericCRUDPageWithUpload';

// Configuration for all modules
const moduleConfigs = {
  'conference-papers': {
    title: 'Indexed Conference Papers',
    apiEndpoint: '/conference-papers',
    fields: [
      { name: 'title', label: 'Paper Title', type: 'text', required: true },
      { name: 'conferenceName', label: 'Conference Name', type: 'text', required: true },
      { name: 'quartile', label: 'Quartile', type: 'select', required: true, options: ['Q1', 'Q2', 'Q3', 'Q4'] },
      { name: 'authorPosition', label: 'Author Position', type: 'number', required: true },
      { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
      { name: 'proofUrl', label: 'Proof URL', type: 'text', required: false }
    ]
  },
  'patents': {
    title: 'Patents',
    apiEndpoint: '/patents',
    fields: [
      { name: 'title', label: 'Patent Title', type: 'text', required: true },
      { name: 'patentNumber', label: 'Patent Number', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['Filed', 'Published', 'Granted'] },
      { name: 'grantDate', label: 'Grant Date', type: 'date', required: true },
      { name: 'proofUrl', label: 'Proof URL', type: 'text', required: false }
    ]
  },
  'awards': {
    title: 'Awards & Honours',
    apiEndpoint: '/awards',
    fields: [
      { name: 'awardName', label: 'Award Name', type: 'text', required: true },
      { name: 'awardedBy', label: 'Awarded By', type: 'text', required: true },
      { name: 'awardDate', label: 'Award Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ]
  },
  'books': {
    title: 'Books / Book Chapters',
    apiEndpoint: '/books',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publisher', label: 'Publisher', type: 'text', required: true },
      { name: 'isbn', label: 'ISBN', type: 'text', required: false },
      { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true }
    ]
  },
  'disclosures': {
    title: 'Disclosures Filed',
    apiEndpoint: '/disclosures',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'filingDate', label: 'Filing Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ]
  },
  'non-indexed-publications': {
    title: 'Non-Indexed Publications',
    apiEndpoint: '/non-indexed-publications',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true, options: ['Journal', 'Conference'] },
      { name: 'authorPosition', label: 'Author Position', type: 'number', required: true },
      { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
      { name: 'proofUrl', label: 'Proof URL', type: 'text', required: false }
    ]
  },
  'fci-scores': {
    title: 'FCI Score',
    apiEndpoint: '/fci-scores',
    fields: [
      { name: 'courseCode', label: 'Course Code', type: 'text', required: true },
      { name: 'courseName', label: 'Course Name', type: 'text', required: true },
      { name: 'score', label: 'Score', type: 'number', required: true }
    ]
  },
  'ug-guidance': {
    title: 'UG Research Guidance',
    apiEndpoint: '/ug-guidance',
    fields: [
      { name: 'studentName', label: 'Student Name', type: 'text', required: true },
      { name: 'projectTitle', label: 'Project Title', type: 'text', required: true },
      { name: 'numberOfStudents', label: 'Number of Students', type: 'number', required: true },
      { name: 'completionDate', label: 'Completion Date', type: 'date', required: false }
    ]
  },
  'masters-guidance': {
    title: "Master's Research Guidance",
    apiEndpoint: '/masters-guidance',
    fields: [
      { name: 'numberOfStudents', label: 'Number of Students', type: 'number', required: true },
      { name: 'thesisTitle', label: 'Thesis Title', type: 'text', required: false },
      { name: 'remarks', label: 'Remarks', type: 'textarea', required: false }
    ]
  },
  'phd-guidance': {
    title: 'PhD Research Guidance',
    apiEndpoint: '/phd-guidance',
    fields: [
      { name: 'numberOfScholars', label: 'Number of Scholars', type: 'number', required: true },
      { name: 'scholarName', label: 'Scholar Name', type: 'text', required: false },
      { name: 'researchArea', label: 'Research Area', type: 'text', required: false },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['Ongoing', 'Completed', 'Submitted'] }
    ]
  },
  'funded-projects': {
    title: 'Funded Projects',
    apiEndpoint: '/funded-projects',
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'fundingAmount', label: 'Funding Amount', type: 'number', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['≥10 Lakhs','5-10 Lakhs','1-5 Lakhs','<1 Lakh'] },
      { name: 'fundingAgency', label: 'Funding Agency', type: 'text', required: false },
      { name: 'startDate', label: 'Start Date', type: 'date', required: false },
      { name: 'endDate', label: 'End Date', type: 'date', required: false }
    ]
  },
  'consulting-projects': {
    title: 'Consulting Projects',
    apiEndpoint: '/consulting-projects',
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true },
      { name: 'clientName', label: 'Client Name', type: 'text', required: false },
      { name: 'completionDate', label: 'Completion Date', type: 'date', required: false }
    ]
  },
  'reviewer-roles': {
    title: 'Reviewer Roles',
    apiEndpoint: '/reviewer-roles',
    fields: [
      { name: 'venue', label: 'Venue', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true }
    ]
  },
  'fdp-organized': {
    title: 'FDP/Events Organized',
    apiEndpoint: '/fdp-organized',
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true }
    ]
  },
  'invited-talks': {
    title: 'Invited Talks',
    apiEndpoint: '/invited-talks',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'venue', label: 'Venue', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true }
    ]
  },
  'events-outside': {
    title: 'Events Outside Institute',
    apiEndpoint: '/events-outside',
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true },
      { name: 'organizer', label: 'Organizer', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true }
    ]
  },
  'events-inside': {
    title: 'Events Inside Institute',
    apiEndpoint: '/events-inside',
    fields: [
      { name: 'eventName', label: 'Event Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true }
    ]
  },
  'industry-relations': {
    title: 'Industry Relations',
    apiEndpoint: '/industry-relations',
    fields: [
      { name: 'organization', label: 'Organization', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true }
    ]
  },
  'institutional-services': {
    title: 'Institutional Services',
    apiEndpoint: '/institutional-services',
    fields: [
      { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true }
    ]
  },
  'other-services': {
    title: 'Other Services',
    apiEndpoint: '/other-services',
    fields: [
      { name: 'serviceName', label: 'Service Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ]
  },
  'professionalism': {
    title: 'Professionalism',
    apiEndpoint: '/professionalism',
    fields: [
      { name: 'rating', label: 'Rating', type: 'number', required: true },
      { name: 'remarks', label: 'Remarks', type: 'textarea', required: false }
    ]
  },
  'other-contributions': {
    title: 'Other Contributions',
    apiEndpoint: '/other-contributions',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ]
  }
};

// Universal page component
const UniversalModulePage = ({ moduleKey }) => {
  const config = moduleConfigs[moduleKey];
  
  if (!config) {
    return <div>Module configuration not found</div>;
  }

  return (
    <GenericCRUDPageWithUpload
      title={config.title}
      apiEndpoint={config.apiEndpoint}
      fields={config.fields}
      termRequired={true}
      supportsFileUpload={true}
    />
  );
};

// Export individual page components
export const ConferencePapersPageNew = () => <UniversalModulePage moduleKey="conference-papers" />;
export const PatentsPageNew = () => <UniversalModulePage moduleKey="patents" />;
export const AwardsPageNew = () => <UniversalModulePage moduleKey="awards" />;
export const BooksPageNew = () => <UniversalModulePage moduleKey="books" />;
export const DisclosuresPageNew = () => <UniversalModulePage moduleKey="disclosures" />;
export const NonIndexedPublicationsPageNew = () => <UniversalModulePage moduleKey="non-indexed-publications" />;
export const FCIScorePageNew = () => <UniversalModulePage moduleKey="fci-scores" />;
export const UGGuidancePageNew = () => <UniversalModulePage moduleKey="ug-guidance" />;
export const MastersGuidancePageNew = () => <UniversalModulePage moduleKey="masters-guidance" />;
export const PhDGuidancePageNew = () => <UniversalModulePage moduleKey="phd-guidance" />;
export const FundedProjectsPageNew = () => <UniversalModulePage moduleKey="funded-projects" />;
export const ConsultingProjectsPageNew = () => <UniversalModulePage moduleKey="consulting-projects" />;
export const ReviewerRolesPageNew = () => <UniversalModulePage moduleKey="reviewer-roles" />;
export const FDPOrganizedPageNew = () => <UniversalModulePage moduleKey="fdp-organized" />;
export const InvitedTalksPageNew = () => <UniversalModulePage moduleKey="invited-talks" />;
export const EventsOutsidePageNew = () => <UniversalModulePage moduleKey="events-outside" />;
export const EventsInsidePageNew = () => <UniversalModulePage moduleKey="events-inside" />;
export const IndustryRelationsPageNew = () => <UniversalModulePage moduleKey="industry-relations" />;
export const InstitutionalServicesPageNew = () => <UniversalModulePage moduleKey="institutional-services" />;
export const OtherServicesPageNew = () => <UniversalModulePage moduleKey="other-services" />;
export const ProfessionalismPageNew = () => <UniversalModulePage moduleKey="professionalism" />;
export const OtherContributionsPageNew = () => <UniversalModulePage moduleKey="other-contributions" />;

export default UniversalModulePage;
