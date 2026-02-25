import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { conferencePaperService } from '../services/api';

export default function ConferencePapersPage() {
  return (
    <GenericCRUDPage
      title="Indexed Conference Papers"
      description="Conference papers indexed in SJR/Scopus/WoS"
      service={conferencePaperService}
      columns={[
        { field: 'title', header: 'Title' },
        { field: 'conferenceName', header: 'Conference Name' },
        { field: 'authorPosition', header: 'Author Position' },
        { field: 'publicationDate', header: 'Publication Date', render: (val) => new Date(val).toLocaleDateString() },
        { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
      ]}
      formFields={[
        { name: 'title', label: 'Paper Title', required: true, fullWidth: true },
        { name: 'conferenceName', label: 'Conference Name', required: true, fullWidth: true },
        { name: 'authorPosition', label: 'Author Position (1-3)', type: 'number', required: true, inputProps: { min: 1, max: 3 } },
        { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
        { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
      ]}
      initialFormData={{ title: '', conferenceName: '', authorPosition: '', publicationDate: '', proof: null }}
    />
  );
}
