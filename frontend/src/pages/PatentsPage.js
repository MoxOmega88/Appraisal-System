import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { patentService } from '../services/api';

export default function PatentsPage() {
  return (
    <GenericCRUDPage
      title="Patents Granted"
      description="Patents that have been granted"
      service={patentService}
      columns={[
        { field: 'title', header: 'Title' },
        { field: 'patentNumber', header: 'Patent Number' },
        { field: 'grantDate', header: 'Grant Date', render: (val) => new Date(val).toLocaleDateString() },
        { field: 'proofUrl', header: 'Proof', render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer">View PDF</a> : 'No proof' },
      ]}
      formFields={[
        { name: 'title', label: 'Patent Title', required: true, fullWidth: true },
        { name: 'patentNumber', label: 'Patent Number', required: true },
        { name: 'grantDate', label: 'Grant Date', type: 'date', required: true },
        { name: 'proof', label: 'Upload Proof (PDF)', type: 'file', required: true, fullWidth: true },
      ]}
      initialFormData={{ title: '', patentNumber: '', grantDate: '', proof: null }}
    />
  );
}
