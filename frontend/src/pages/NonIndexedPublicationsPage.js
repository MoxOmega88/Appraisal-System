import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { nonIndexedPublicationService } from '../services/api';

export default function NonIndexedPublicationsPage() {
  return (
    <GenericCRUDPage
      title="Non-Indexed Publications"
      description="Non-refereed journals and non-indexed conferences"
      service={nonIndexedPublicationService}
      columns={[
        { field: 'title', header: 'Title' },
        { field: 'type', header: 'Type' },
        { field: 'authorPosition', header: 'Author Position' },
        { field: 'publicationDate', header: 'Publication Date', render: (val) => new Date(val).toLocaleDateString() },
      ]}
      formFields={[
        { name: 'title', label: 'Title', required: true, fullWidth: true },
        { name: 'type', label: 'Type', type: 'select', required: true, options: ['Journal', 'Conference'] },
        { name: 'authorPosition', label: 'Author Position', type: 'number', required: true, inputProps: { min: 1 } },
        { name: 'publicationDate', label: 'Publication Date', type: 'date', required: true },
      ]}
      initialFormData={{ title: '', type: '', authorPosition: '', publicationDate: '' }}
    />
  );
}
