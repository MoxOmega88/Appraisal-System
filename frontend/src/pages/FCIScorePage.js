import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { fciScoreService } from '../services/api';

export default function FCIScorePage() {
  return (
    <GenericCRUDPage
      title="FCI Score"
      description="Faculty Course Interaction Score - Average of all courses handled"
      service={fciScoreService}
      columns={[
        { field: 'averageScore', header: 'Average Score' },
        { field: 'numberOfCourses', header: 'Number of Courses' },
        { field: 'remarks', header: 'Remarks' },
      ]}
      formFields={[
        { name: 'averageScore', label: 'Average Score', type: 'number', required: true, inputProps: { min: 0, max: 10, step: 0.1 } },
        { name: 'numberOfCourses', label: 'Number of Courses', type: 'number', required: true, inputProps: { min: 1 } },
        { name: 'remarks', label: 'Remarks', fullWidth: true, multiline: true, rows: 3 },
      ]}
      initialFormData={{ averageScore: '', numberOfCourses: '', remarks: '' }}
    />
  );
}
