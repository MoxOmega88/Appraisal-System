const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Category folder mapping
const categoryFolders = {
  'fci-scores': '01_FCI_Score',
  'journal-papers': '02_Journal_Papers',
  'conference-papers': '03_Indexed_Conferences',
  'non-indexed-publications': '04_NonIndexed_Publications',
  'books': '05_Books_Chapters',
  'disclosures': '06_Disclosures_Filed',
  'patents': '07_Patents_Granted',
  'ug-guidance': '08_UG_Guidance',
  'masters-guidance': '09_Masters_Guidance',
  'phd-guidance': '10_PhD_Guidance',
  'funded-projects': '11_Funded_Projects',
  'consulting-projects': '12_Consulting_Projects',
  'reviewer-roles': '13_Reviewer_Roles',
  'fdp-organized': '14_FDP_Organized',
  'invited-talks': '15_Invited_Talks',
  'events-outside': '16_Events_Outside',
  'events-inside': '17_Events_Inside',
  'industry-relations': '18_Industry_Relations',
  'institutional-services': '19_Institutional_Services',
  'other-services': '20_Other_Services',
  'awards': '21_Awards',
  'professionalism': '22_Professionalism',
  'other-contributions': '23_Other_Contributions'
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.baseUrl.split('/').pop(); // Extract category from route
    const folderName = categoryFolders[category] || 'misc';
    const uploadPath = path.join(__dirname, '../uploads', folderName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter - only allow PDF, DOC, DOCX, images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and image files are allowed!'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = { upload, categoryFolders };
