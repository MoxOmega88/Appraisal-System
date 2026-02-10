import React from 'react';
import GenericCRUDPage from '../components/GenericCRUDPage';
import { bookService } from '../services/api';

export default function BooksPage() {
  return (
    <GenericCRUDPage
      title="Books / Book Chapters"
      description="Books and book chapters published"
      service={bookService}
      columns={[
        { field: 'type', header: 'Type' },
        { field: 'title', header: 'Title' },
        { field: 'publisher', header: 'Publisher' },
        { field: 'authorPosition', header: 'Author Position' },
        { field: 'publicationYear', header: 'Year' },
      ]}
      formFields={[
        { name: 'type', label: 'Type', type: 'select', required: true, options: ['Book', 'Chapter'] },
        { name: 'title', label: 'Title', required: true, fullWidth: true },
        { name: 'authorPosition', label: 'Author Position (1-3)', type: 'number', required: true, inputProps: { min: 1, max: 3 } },
        { name: 'publisher', label: 'Publisher', required: true },
        { name: 'publicationYear', label: 'Publication Year', type: 'number', required: true, inputProps: { min: 1900, max: 2100 } },
        { name: 'isbn', label: 'ISBN (Optional)' },
      ]}
      initialFormData={{ type: '', title: '', authorPosition: '', publisher: '', publicationYear: '', isbn: '' }}
    />
  );
}
