import React, { useState } from 'react';
import { Button, Box, Typography, Chip, Stack } from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircle as CheckCircleIcon, Close as CloseIcon } from '@mui/icons-material';

const FileUploadButton = ({ onFileSelect, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png', label = 'Upload Files', multiple = true }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      onFileSelect(files);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload-button"
        type="file"
        multiple={multiple}
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
      
      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedFiles.map((file, index) => (
              <Chip
                key={index}
                icon={<CheckCircleIcon />}
                label={`${file.name} (${(file.size / 1024).toFixed(2)} KB)`}
                onDelete={() => handleRemoveFile(index)}
                deleteIcon={<CloseIcon />}
                color="success"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}
      
      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file, up to 10 files)
      </Typography>
    </Box>
  );
};

export default FileUploadButton;
