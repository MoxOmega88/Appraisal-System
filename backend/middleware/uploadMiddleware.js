const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.baseUrl.split('/').pop();
    const folderName = categoryFolders[category] || 'misc';
    const uploadPath = path.join(__dirname, '../uploads', folderName);
    
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

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB
  fileFilter: fileFilter
});

module.exports = { upload, categoryFolders };
