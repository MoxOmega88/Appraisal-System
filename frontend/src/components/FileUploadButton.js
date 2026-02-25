import React, { useState } from 'react';
import { Button, Box, Typography, Chip } from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const FileUploadButton = ({ onFileSelect, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png', label = 'Upload File' }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload-button"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload-button">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{
            py: 1.5,
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
              backgroundColor: 'rgba(26, 35, 126, 0.04)'
            }
          }}
        >
          {label}
        </Button>
      </label>
      
      {selectedFile && (
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon color="success" />
          <Chip
            label={selectedFile.name}
            color="success"
            variant="outlined"
            onDelete={() => {
              setSelectedFile(null);
              onFileSelect(null);
            }}
          />
          <Typography variant="caption" color="text.secondary">
            ({(selectedFile.size / 1024).toFixed(2)} KB)
          </Typography>
        </Box>
      )}
      
      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
      </Typography>
    </Box>
  );
};

export default FileUploadButton;
