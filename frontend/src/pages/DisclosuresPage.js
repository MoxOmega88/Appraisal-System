import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { disclosureService } from '../services/api';

export default function DisclosuresPage() {
  return (
    <GenericCRUDPage
      title="Disclosures Filed"
      description="Patent disclosures filed"
      service={disclosureService}
      columns={[
        { field: 'title', header: 'Title' },
        { field: 'filingDate', header: 'Filing Date', render: (val) => new Date(val).toLocaleDateString() },
        { field: 'applicationNumber', header: 'Application Number' },
      ]}
      formFields={[
        { name: 'title', label: 'Disclosure Title', required: true, fullWidth: true },
        { name: 'filingDate', label: 'Filing Date', type: 'date', required: true },
        { name: 'applicationNumber', label: 'Application Number (Optional)' },
      ]}
      initialFormData={{ title: '', filingDate: '', applicationNumber: '' }}
    />
  );
}
