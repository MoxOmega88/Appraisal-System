const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Import all models
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

/**
 * Generate ZIP with only uploaded files (no PDF)
 * GET /api/generate-zip/:termId
 */
exports.generateZipOnly = async (req, res) => {
  try {
    const { termId } = req.params;
    const facultyId = req.user.id;
    
    // Fetch faculty and term data
    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);
    
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    
    // Fetch all appraisal data
    const appraisalData = {
      fciScores: await FCIScore.find({ facultyId, termId }),
      journalPapers: await JournalPaper.find({ facultyId, termId }),
      conferencePapers: await ConferencePaper.find({ facultyId, termId }),
      nonIndexedPublications: await NonIndexedPublication.find({ facultyId, termId }),
      books: await Book.find({ facultyId, termId }),
      disclosures: await Disclosure.find({ facultyId, termId }),
      patents: await Patent.find({ facultyId, termId }),
      ugGuidance: await UGGuidance.find({ facultyId, termId }),
      mastersGuidance: await MastersGuidance.find({ facultyId, termId }),
      phdGuidance: await PhDGuidance.find({ facultyId, termId }),
      fundedProjects: await FundedProject.find({ facultyId, termId }),
      consultingProjects: await ConsultingProject.find({ facultyId, termId }),
      reviewerRoles: await ReviewerRole.find({ facultyId, termId }),
      fdpOrganized: await FDPOrganized.find({ facultyId, termId }),
      invitedTalks: await InvitedTalk.find({ facultyId, termId }),
      eventsOutside: await EventOutside.find({ facultyId, termId }),
      eventsInside: await EventInside.find({ facultyId, termId }),
      industryRelations: await IndustryRelation.find({ facultyId, termId }),
      institutionalServices: await InstitutionalService.find({ facultyId, termId }),
      otherServices: await OtherService.find({ facultyId, termId }),
      awards: await Award.find({ facultyId, termId }),
      professionalism: await Professionalism.find({ facultyId, termId }),
      otherContributions: await OtherContribution.find({ facultyId, termId })
    };
    
    // Create ZIP file
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    // Set response headers
    const zipFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Files.zip`;
    res.attachment(zipFileName);
    res.setHeader('Content-Type', 'application/zip');
    
    // Pipe archive to response
    archive.pipe(res);
    
    // Category folder mapping
    const categoryMapping = [
      { key: 'fciScores', folder: '01_FCI_Score' },
      { key: 'journalPapers', folder: '02_Journal_Papers' },
      { key: 'conferencePapers', folder: '03_Indexed_Conferences' },
      { key: 'nonIndexedPublications', folder: '04_NonIndexed_Publications' },
      { key: 'books', folder: '05_Books_Chapters' },
      { key: 'disclosures', folder: '06_Disclosures_Filed' },
      { key: 'patents', folder: '07_Patents_Granted' },
      { key: 'ugGuidance', folder: '08_UG_Guidance' },
      { key: 'mastersGuidance', folder: '09_Masters_Guidance' },
      { key: 'phdGuidance', folder: '10_PhD_Guidance' },
      { key: 'fundedProjects', folder: '11_Funded_Projects' },
      { key: 'consultingProjects', folder: '12_Consulting_Projects' },
      { key: 'reviewerRoles', folder: '13_Reviewer_Roles' },
      { key: 'fdpOrganized', folder: '14_FDP_Organized' },
      { key: 'invitedTalks', folder: '15_Invited_Talks' },
      { key: 'eventsOutside', folder: '16_Events_Outside' },
      { key: 'eventsInside', folder: '17_Events_Inside' },
      { key: 'industryRelations', folder: '18_Industry_Relations' },
      { key: 'institutionalServices', folder: '19_Institutional_Services' },
      { key: 'otherServices', folder: '20_Other_Services' },
      { key: 'awards', folder: '21_Awards' },
      { key: 'professionalism', folder: '22_Professionalism' },
      { key: 'otherContributions', folder: '23_Other_Contributions' }
    ];
    
    let hasFiles = false;
    
    // Add files to ZIP in organized folders
    for (const category of categoryMapping) {
      const data = appraisalData[category.key];
      
      if (data && data.length > 0) {
        for (const item of data) {
          if (item.filePath) {
            // Convert URL path to file system path
            const fullPath = path.join(__dirname, '..', item.filePath.replace(/^\//, ''));
            if (fs.existsSync(fullPath)) {
              const fileName = path.basename(item.filePath);
              archive.file(fullPath, { name: `${category.folder}/${fileName}` });
              hasFiles = true;
            }
          }
        }
      }
    }
    
    if (!hasFiles) {
      // If no files, add a readme
      archive.append('No files have been uploaded for this term.', { name: 'README.txt' });
    }
    
    // Finalize the archive
    await archive.finalize();
    
  } catch (error) {
    console.error('Error generating ZIP:', error);
    res.status(500).json({ 
      message: 'Error generating ZIP file', 
      error: error.message 
    });
  }
};

module.exports = exports;
