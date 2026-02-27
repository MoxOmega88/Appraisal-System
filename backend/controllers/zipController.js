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
 * Organized in 23 folders with sequentially named files
 * GET /api/generate-zip/:termId
 */
exports.generateZipOnly = async (req, res) => {
  let archive = null;

  try {
    const { termId } = req.params;
    const facultyId = req.user.id;
    
    // Fetch faculty and term data
    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);
    
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    
    // Fetch all appraisal data in official order (23 modules)
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
    
    // Category mapping with official order (23 modules)
    const categoryMapping = [
      { key: 'fciScores', folder: '01_FCI_Score', moduleName: 'FCI_Score' },
      { key: 'journalPapers', folder: '02_Journal_Papers', moduleName: 'Journal_Paper' },
      { key: 'conferencePapers', folder: '03_Indexed_Conferences', moduleName: 'Conference_Paper' },
      { key: 'nonIndexedPublications', folder: '04_NonIndexed_Publications', moduleName: 'NonIndexed_Publication' },
      { key: 'books', folder: '05_Books_Chapters', moduleName: 'Book' },
      { key: 'disclosures', folder: '06_Disclosures_Filed', moduleName: 'Disclosure' },
      { key: 'patents', folder: '07_Patents_Granted', moduleName: 'Patent' },
      { key: 'ugGuidance', folder: '08_UG_Guidance', moduleName: 'UG_Guidance' },
      { key: 'mastersGuidance', folder: '09_Masters_Guidance', moduleName: 'Masters_Guidance' },
      { key: 'phdGuidance', folder: '10_PhD_Guidance', moduleName: 'PhD_Guidance' },
      { key: 'fundedProjects', folder: '11_Funded_Projects', moduleName: 'Funded_Project' },
      { key: 'consultingProjects', folder: '12_Consulting_Projects', moduleName: 'Consulting_Project' },
      { key: 'reviewerRoles', folder: '13_Reviewer_Roles', moduleName: 'Reviewer_Role' },
      { key: 'fdpOrganized', folder: '14_FDP_Organized', moduleName: 'FDP_Organized' },
      { key: 'invitedTalks', folder: '15_Invited_Talks', moduleName: 'Invited_Talk' },
      { key: 'eventsOutside', folder: '16_Events_Outside', moduleName: 'Event_Outside' },
      { key: 'eventsInside', folder: '17_Events_Inside', moduleName: 'Event_Inside' },
      { key: 'industryRelations', folder: '18_Industry_Relations', moduleName: 'Industry_Relation' },
      { key: 'institutionalServices', folder: '19_Institutional_Services', moduleName: 'Institutional_Service' },
      { key: 'otherServices', folder: '20_Other_Services', moduleName: 'Other_Service' },
      { key: 'awards', folder: '21_Awards', moduleName: 'Award' },
      { key: 'professionalism', folder: '22_Professionalism', moduleName: 'Professionalism' },
      { key: 'otherContributions', folder: '23_Other_Contributions', moduleName: 'Other_Contribution' }
    ];
    
    // Create ZIP file
    archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    // Set response headers
    const zipFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Files.zip`;
    res.attachment(zipFileName);
    res.setHeader('Content-Type', 'application/zip');
    
    // Handle archive errors
    archive.on('error', (error) => {
      console.error('Archive error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating ZIP file', error: error.message });
      }
    });
    
    // Pipe archive to response
    archive.pipe(res);
    
    let totalFilesAdded = 0;
    let missingFiles = [];
    
    // Process each module in official order
    for (const category of categoryMapping) {
      const data = appraisalData[category.key];
      
      // Skip modules with no data
      if (!data || data.length === 0) {
        console.log(`✓ Module ${category.folder}: No records (skipped)`);
        continue;
      }
      
      let fileCountForModule = 0;
      
      // Process each item in the module
      for (const item of data) {
        if (item.filePath) {
          try {
            // Resolve absolute file path from MongoDB stored path
            const fullPath = path.resolve(__dirname, '..', item.filePath.replace(/^\//, ''));
            
            // Verify file exists
            if (!fs.existsSync(fullPath)) {
              const errorMsg = `FILE_NOT_FOUND: ${fullPath} for ${category.moduleName}`;
              console.error(`❌ ${errorMsg}`);
              missingFiles.push({
                module: category.folder,
                storedPath: item.filePath,
                resolvedPath: fullPath
              });
              continue;
            }
            
            // Get file extension
            const fileExtension = path.extname(fullPath);
            
            // Sequential file naming: ModuleName(1).ext, ModuleName(2).ext, etc.
            const newFileName = `${category.moduleName}(${fileCountForModule + 1})${fileExtension}`;
            const zipPathName = `${category.folder}/${newFileName}`;
            
            // Add file to archive
            await archive.file(fullPath, { name: zipPathName });
            
            fileCountForModule++;
            totalFilesAdded++;
            
            console.log(`✓ Added: ${zipPathName}`);
            
          } catch (fileError) {
            console.error(`❌ Error processing file for ${category.folder}:`, fileError.message);
            missingFiles.push({
              module: category.folder,
              storedPath: item.filePath,
              error: fileError.message
            });
          }
        }
      }
      
      if (fileCountForModule > 0) {
        console.log(`✓ Module ${category.folder}: Added ${fileCountForModule} file(s)`);
      }
    }
    
    // Add summary file with logging info
    let summaryContent = `APPRAISAL FILE SUMMARY\n`;
    summaryContent += `======================\n\n`;
    summaryContent += `Faculty: ${faculty.name}\n`;
    summaryContent += `Term: ${term.termName}\n`;
    summaryContent += `Generated: ${new Date().toISOString()}\n\n`;
    summaryContent += `Total Files Added: ${totalFilesAdded}\n`;
    
    if (missingFiles.length > 0) {
      summaryContent += `\nMissing/Error Files (${missingFiles.length}):\n`;
      summaryContent += `-----------------------------------------\n`;
      missingFiles.forEach((file, index) => {
        summaryContent += `\n${index + 1}. Module: ${file.module}\n`;
        summaryContent += `   Stored Path: ${file.storedPath}\n`;
        if (file.resolvedPath) {
          summaryContent += `   Resolved Path: ${file.resolvedPath}\n`;
        }
        if (file.error) {
          summaryContent += `   Error: ${file.error}\n`;
        }
      });
    } else {
      summaryContent += `\nAll files successfully added!\n`;
    }
    
    archive.append(summaryContent, { name: '_SUMMARY.txt' });
    
    // Finalize archive only after all files are processed
    await archive.finalize();
    
    console.log(`✅ ZIP generation complete: ${totalFilesAdded} file(s) added`);
    
  } catch (error) {
    console.error('❌ Error generating ZIP:', error);
    
    try {
      if (archive) {
        archive.abort();
      }
    } catch (abortError) {
      console.error('Error aborting archive:', abortError);
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error generating ZIP file', 
        error: error.message 
      });
    }
  }
};



async function generateZip(req, res) {
  let archive = null;

  // helper: recursively collect any "filePath" values in an object/array
  function extractFilePaths(obj, results = []) {
    if (!obj || typeof obj !== 'object') return results;
    if (Array.isArray(obj)) {
      for (const el of obj) extractFilePaths(el, results);
    } else {
      for (const key of Object.keys(obj)) {
        if (key === 'filePath' && typeof obj[key] === 'string') {
          results.push(obj[key]);
        } else {
          extractFilePaths(obj[key], results);
        }
      }
    }
    return results;
  }

  // configuration for all 23 modules in official order
  const MODULE_CONFIG = [
    { order: 1, name: 'FCI Score (Average of all courses handled)', model: FCIScore, fileFields: ['documents'] },
    { order: 2, name: 'No. of refereed journal papers in SJR/Scopus/Web of Science (Faculty among first 3 authors)', model: JournalPaper, fileFields: ['documents', 'files', 'attachments'] },
    { order: 3, name: 'No. of indexed conference papers in SJR/Scopus/Web of Science (Faculty among first 3 authors)', model: ConferencePaper, fileFields: ['documents', 'files', 'attachments'] },
    { order: 4, name: 'No. of non-refereed journals and non-indexed conferences (Faculty among first 3 authors)', model: NonIndexedPublication, fileFields: ['documents', 'files', 'attachments'] },
    { order: 5, name: 'Books/Chapters (Books + Book Chapters)', model: Book, fileFields: ['documents', 'files', 'attachments'] },
    { order: 6, name: 'Disclosures Filed', model: Disclosure, fileFields: ['documents', 'files', 'attachments'] },
    { order: 7, name: 'Patents Granted', model: Patent, fileFields: ['documents', 'files', 'attachments'] },
    { order: 8, name: 'Research Guidance Under Graduate Program', model: UGGuidance, fileFields: ['documents', 'files', 'attachments'] },
    { order: 9, name: 'Research Guidance Master\'s Program', model: MastersGuidance, fileFields: ['documents', 'files', 'attachments'] },
    { order: 10, name: 'Research Guidance Ph.D.', model: PhDGuidance, fileFields: ['documents', 'files', 'attachments'] },
    { order: 11, name: 'Funded Projects (>=10L, >=5L<10L, >=1L<5L, <1L)', model: FundedProject, fileFields: ['documents', 'files', 'attachments'] },
    { order: 12, name: 'Consulting Projects', model: ConsultingProject, fileFields: ['documents', 'files', 'attachments'] },
    { order: 13, name: 'Conference Chair / Session Chair / Reviewer of Q1 or Q2 Journal', model: ReviewerRole, fileFields: ['documents', 'files', 'attachments'] },
    { order: 14, name: 'FDP/Seminar/Workshop Organized as Coordinator (5 Days, 3 Days)', model: FDPOrganized, fileFields: ['documents', 'files', 'attachments'] },
    { order: 15, name: 'Invited Technical Talks Outside Institute', model: InvitedTalk, fileFields: ['documents', 'files', 'attachments'] },
    { order: 16, name: 'Events Participated Outside Institute', model: EventOutside, fileFields: ['documents', 'files', 'attachments'] },
    { order: 17, name: 'Events Participated Inside Institute', model: EventInside, fileFields: ['documents', 'files', 'attachments'] },
    { order: 18, name: 'Industry Relations (MoU, Co-hosted Event, Technical Talk Series)', model: IndustryRelation, fileFields: ['documents', 'files', 'attachments'] },
    { order: 19, name: 'Institutional/Departmental Services (Coordinator, Others)', model: InstitutionalService, fileFields: ['documents', 'files', 'attachments'] },
    { order: 20, name: 'Other Services to Institution or Society', model: OtherService, fileFields: ['documents', 'files', 'attachments'] },
    { order: 21, name: 'Awards and Honours', model: Award, fileFields: ['documents', 'files', 'attachments'] },
    { order: 22, name: 'Professionalism / Team Spirit', model: Professionalism, fileFields: ['documents', 'files', 'attachments'] },
    { order: 23, name: 'Any Other Major Contributions', model: OtherContribution, fileFields: ['documents', 'files', 'attachments'] }
  ];

  try {
    const { termId } = req.params;
    const facultyId = req.user.id || req.user._id;

    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    // query all modules
    const results = {};
    for (const cfg of MODULE_CONFIG) {
      results[cfg.order] = await cfg.model.find({ facultyId, termId });
    }

    // prepare archive
    archive = archiver('zip', { zlib: { level: 9 } });
    const zipFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Appraisal.zip`;
    res.attachment(zipFileName);
    res.setHeader('Content-Type', 'application/zip');

    archive.on('error', (error) => {
      console.error('Archive error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating ZIP file', error: error.message });
      }
    });

    archive.pipe(res);

    let totalFilesAdded = 0;
    const missingFiles = [];
    let anyFileAdded = false;

    for (const cfg of MODULE_CONFIG) {
      const records = results[cfg.order] || [];
      if (!records.length) {
        console.log(`✓ Module ${cfg.order} (${cfg.name}): No records`);
        continue;
      }

      const folderName = String(cfg.order).padStart(2, '0') + '_' +
        cfg.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      let fileCount = 0;

      for (const rec of records) {
        const paths = extractFilePaths(rec);
        for (const relPath of paths) {
          const fullPath = path.resolve(__dirname, '..', relPath.replace(/^\/?\.?\//, ''));
          if (!fs.existsSync(fullPath)) {
            console.warn('Missing file:', fullPath);
            missingFiles.push({ module: folderName, storedPath: relPath, resolvedPath: fullPath });
            continue;
          }

          const ext = path.extname(fullPath);
          fileCount++;
          const cleanName = cfg.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
          const newName = `${cleanName}(${fileCount})${ext}`;
          const zipPath = `${folderName}/${newName}`;

          await archive.file(fullPath, { name: zipPath });
          totalFilesAdded++;
          anyFileAdded = true;
          console.log(`✓ Added: ${zipPath}`);
        }
      }

      if (fileCount) {
        console.log(`✓ Module ${folderName}: Added ${fileCount} file(s)`);
      }
    }

    if (!anyFileAdded) {
      archive.append('No files found for any module.', { name: 'message.txt' });
    }

    // summary
    let summary = `APPRAISAL FILE SUMMARY\n`;
    summary += `======================\n\n`;
    summary += `Faculty: ${faculty.name}\n`;
    summary += `Term: ${term.termName}\n`;
    summary += `Generated: ${new Date().toISOString()}\n\n`;
    summary += `Total Files Added: ${totalFilesAdded}\n`;
    if (missingFiles.length) {
      summary += `\nMissing/Error Files (${missingFiles.length}):\n`;
      summary += `-----------------------------------------\n`;
      missingFiles.forEach((f, i) => {
        summary += `\n${i + 1}. Module: ${f.module}\n`;
        summary += `   Stored Path: ${f.storedPath}\n`;
        if (f.resolvedPath) summary += `   Resolved Path: ${f.resolvedPath}\n`;
        if (f.error) summary += `   Error: ${f.error}\n`;
      });
    } else {
      summary += `\nAll files successfully added!\n`;
    }
    archive.append(summary, { name: '_SUMMARY.txt' });

    await archive.finalize();
    console.log(`✅ ZIP generation complete: ${totalFilesAdded} file(s) added`);

  } catch (error) {
    console.error('❌ Error generating ZIP:', error);
    if (archive) {
      try { archive.abort(); } catch (e) { console.error('Error aborting archive:', e); }
    }
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating ZIP file', error: error.message });
    }
  }
}

module.exports = { generateZipOnly: exports.generateZipOnly, generateZip };
