import React from 'react';
import GenericCRUDPageWithUpload from '../components/GenericCRUDPageWithUpload';

const JournalPapersPageNew = () => {
  const fields = [
    { name: 'title', label: 'Paper Title', type: 'text', required: true },
    { name: 'journalName', label: 'Journal Name', type: 'text', required: true },
    { 
      name: 'indexedIn', 
      label: 'Indexed In', 
      type: 'select', 
      required: true,
      options: ['SJR', 'Scopus', 'WoS', 'SJR & Scopus', 'SJR & WoS', 'Scopus & WoS', 'All']
    },
    { 
      name: 'quartile', 
      label: 'Quartile', 
      type: 'select', 
      required: true,
      options: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    { 
      name: 'authorPosition', 
      label: 'Author Position', 
      type: 'number', 
      required: true 
    },
    { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
    { name: 'doi', label: 'DOI', type: 'text', required: false },
    { name: 'proofUrl', label: 'Proof URL', type: 'text', required: false }
  ];

  return (
    <GenericCRUDPageWithUpload
      title="Refereed Journal Papers"
      apiEndpoint="/journal-papers"
      fields={fields}
      termRequired={true}
      supportsFileUpload={true}
    />
  );
};

export default JournalPapersPageNew;
