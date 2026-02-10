import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { journalPaperService } from '../services/api';

export default function JournalPapersPage() {
  return (
    <GenericCRUDPage
      title="Refereed Journal Papers"
      description="Journal papers indexed in SJR/Scopus/WoS"
      service={journalPaperService}
      columns={[
        { field: 'title', header: 'Title' },
        { field: 'journalName', header: 'Journal Name' },
        { field: 'indexedIn', header: 'Indexed In' },
        { field: 'authorPosition', header: 'Author Position' },
        { field: 'publicationDate', header: 'Publication Date', render: (val) => new Date(val).toLocaleDateString() },
      ]}
      formFields={[
        { name: 'title', label: 'Paper Title', required: true, fullWidth: true },
        { name: 'journalName', label: 'Journal Name', required: true },
        { name: 'indexedIn', label: 'Indexed In', type: 'select', required: true, options: ['SJR', 'Scopus', 'WoS', 'SJR & Scopus', 'SJR & WoS', 'Scopus & WoS', 'All'] },
        { name: 'authorPosition', label: 'Author Position (1-3)', type: 'number', required: true, inputProps: { min: 1, max: 3 } },
        { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
        { name: 'doi', label: 'DOI (Optional)' },
      ]}
      initialFormData={{ title: '', journalName: '', indexedIn: '', authorPosition: '', publicationDate: '', doi: '' }}
    />
  );
}
