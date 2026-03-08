const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const User = require('../models/User');
const Term = require('../models/Term');
const FCIScore = require('../models/FCIScore');
const JournalPaper = require('../models/JournalPaper');
const ConferencePaper = require('../models/ConferencePaper');
const NonIndexedPublication = require('../models/NonIndexedPublication');
const Book = require('../models/Book');
const Disclosure = require('../models/Disclosure');
const Patent = require('../models/Patent');
const UGGuidance = require('../models/UGGuidance');
const MastersGuidance = require('../models/MastersGuidance');
const PhDGuidance = require('../models/PhDGuidance');
const FundedProject = require('../models/FundedProject');
const ConsultingProject = require('../models/ConsultingProject');
const ReviewerRole = require('../models/ReviewerRole');
const FDPOrganized = require('../models/FDPOrganized');
const InvitedTalk = require('../models/InvitedTalk');
const EventOutside = require('../models/EventOutside');
const EventInside = require('../models/EventInside');
const IndustryRelation = require('../models/IndustryRelation');
const InstitutionalService = require('../models/InstitutionalService');
const OtherService = require('../models/OtherService');
const Award = require('../models/Award');
const Professionalism = require('../models/Professionalism');
const OtherContribution = require('../models/OtherContribution');

const MODULE_CONFIG = [
  { order: 1, name: 'FCI_Score', folder: '01_FCI_Score', model: FCIScore },
  { order: 2, name: 'Journal_Papers', folder: '02_Journal_Papers', model: JournalPaper },
  { order: 3, name: 'Conference_Papers', folder: '03_Indexed_Conferences', model: ConferencePaper },
  { order: 4, name: 'NonIndexed_Publications', folder: '04_NonIndexed_Publications', model: NonIndexedPublication },
  { order: 5, name: 'Books_Chapters', folder: '05_Books_Chapters', model: Book },
  { order: 6, name: 'Disclosures', folder: '06_Disclosures_Filed', model: Disclosure },
  { order: 7, name: 'Patents', folder: '07_Patents_Granted', model: Patent },
  { order: 8, name: 'UG_Guidance', folder: '08_UG_Guidance', model: UGGuidance },
  { order: 9, name: 'Masters_Guidance', folder: '09_Masters_Guidance', model: MastersGuidance },
  { order: 10, name: 'PhD_Guidance', folder: '10_PhD_Guidance', model: PhDGuidance },
  { order: 11, name: 'Funded_Projects', folder: '11_Funded_Projects', model: FundedProject },
  { order: 12, name: 'Consulting_Projects', folder: '12_Consulting_Projects', model: ConsultingProject },
  { order: 13, name: 'Reviewer_Roles', folder: '13_Reviewer_Roles', model: ReviewerRole },
  { order: 14, name: 'FDP_Organized', folder: '14_FDP_Organized', model: FDPOrganized },
  { order: 15, name: 'Invited_Talks', folder: '15_Invited_Talks', model: InvitedTalk },
  { order: 16, name: 'Events_Outside', folder: '16_Events_Outside', model: EventOutside },
  { order: 17, name: 'Events_Inside', folder: '17_Events_Inside', model: EventInside },
  { order: 18, name: 'Industry_Relations', folder: '18_Industry_Relations', model: IndustryRelation },
  { order: 19, name: 'Institutional_Services', folder: '19_Institutional_Services', model: InstitutionalService },
  { order: 20, name: 'Other_Services', folder: '20_Other_Services', model: OtherService },
  { order: 21, name: 'Awards', folder: '21_Awards', model: Award },
  { order: 22, name: 'Professionalism', folder: '22_Professionalism', model: Professionalism },
  { order: 23, name: 'Other_Contributions', folder: '23_Other_Contributions', model: OtherContribution }
];

exports.generateZipOnly = async (req, res) => {
  try {
    const { termId } = req.params;
    const facultyId = req.user.id;
    
    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);
    
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    const zipFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Files.zip`;
    res.attachment(zipFileName);
    res.setHeader('Content-Type', 'application/zip');
    
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      throw err;
    });
    
    archive.pipe(res);
    
    let totalFiles = 0;
    
    for (const config of MODULE_CONFIG) {
      try {
        const records = await config.model.find({ facultyId, termId });
        console.log(`${config.name}: Found ${records.length} records`);
        
        if (records && records.length > 0) {
          let fileIndex = 1;
          
          for (const record of records) {
            if (record.documents && Array.isArray(record.documents) && record.documents.length > 0) {
              console.log(`  Record has ${record.documents.length} documents`);
              
              for (const doc of record.documents) {
                if (doc.filePath) {
                  // Remove leading slash and construct proper path
                  let relativePath = doc.filePath.startsWith('/') ? doc.filePath.substring(1) : doc.filePath;
                  relativePath = relativePath.replace(/\\/g, '/');
                  
                  // Construct absolute path from backend directory
                  const absolutePath = path.join(__dirname, '..', relativePath);
                  console.log(`  Checking file: ${absolutePath}`);
                  
                  if (fs.existsSync(absolutePath)) {
                    const extension = path.extname(doc.fileName || doc.originalName || '');
                    const fileName = `${config.name}_${fileIndex}${extension}`;
                    
                    archive.file(absolutePath, { name: `${config.folder}/${fileName}` });
                    totalFiles++;
                    fileIndex++;
                    console.log(`  ✓ Added: ${fileName}`);
                  } else {
                    console.warn(`  ✗ File not found: ${absolutePath}`);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error processing ${config.name}:`, err);
      }
    }
    
    console.log(`Total files added to ZIP: ${totalFiles}`);
    
    if (totalFiles === 0) {
      archive.append('No files have been uploaded for this term.\n\nPlease upload documents in the appraisal modules and try again.', { name: 'README.txt' });
    }
    
    await archive.finalize();
    console.log('ZIP finalized successfully');
    
  } catch (error) {
    console.error('Error generating ZIP:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error generating ZIP file', 
        error: error.message 
      });
    }
  }
};

module.exports = exports;
