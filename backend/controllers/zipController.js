const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLibDocument, rgb, StandardFonts } = require('pdf-lib');

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

// Helper function to create summary page
function createSummaryPage(doc, facultyName, termName, selectedModules, documentList, totalDocs) {
  doc.fontSize(24).font('Helvetica-Bold').text('Faculty Appraisal Document Summary', { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(12).font('Helvetica');
  doc.text(`Faculty Name: ${facultyName}`, { continued: false });
  doc.text(`Term: ${termName}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.text(`Total Selected Modules: ${selectedModules}`);
  doc.text(`Total Documents Included: ${totalDocs}`);
  doc.moveDown(2);
  
  // Table header
  doc.fontSize(10).font('Helvetica-Bold');
  const tableTop = doc.y;
  const colWidths = { sl: 40, module: 150, fileName: 200, fileType: 80, included: 80 };
  
  doc.text('Sl No', 50, tableTop, { width: colWidths.sl });
  doc.text('Module', 90, tableTop, { width: colWidths.module });
  doc.text('File Name', 240, tableTop, { width: colWidths.fileName });
  doc.text('File Type', 440, tableTop, { width: colWidths.fileType });
  doc.text('Included', 520, tableTop, { width: colWidths.included });
  
  doc.moveTo(50, tableTop + 15).lineTo(600, tableTop + 15).stroke();
  doc.moveDown(1);
  
  // Table rows
  doc.font('Helvetica').fontSize(9);
  documentList.forEach((item, index) => {
    const y = doc.y;
    if (y > 700) {
      doc.addPage();
      doc.fontSize(9);
    }
    
    doc.text(index + 1, 50, doc.y, { width: colWidths.sl });
    doc.text(item.module, 90, y, { width: colWidths.module });
    doc.text(item.fileName, 240, y, { width: colWidths.fileName });
    doc.text(item.fileType, 440, y, { width: colWidths.fileType });
    doc.text(item.included, 520, y, { width: colWidths.included });
    doc.moveDown(0.5);
  });
}

// Helper function to create separator page using pdf-lib
async function createSeparatorPagePDFLib(pdfDoc, moduleName, fileName, docNumber, totalDocs) {
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const separator = '='.repeat(60);
  
  let yPosition = height - 100;
  
  // Draw separator line
  page.drawText(separator, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  // Module name
  page.drawText(`MODULE: ${moduleName}`, {
    x: width / 2 - (moduleName.length * 4),
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 30;
  
  // File name
  const fileText = `FILE: ${fileName}`;
  page.drawText(fileText, {
    x: width / 2 - (fileText.length * 3),
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 30;
  
  // Document number
  const docText = `DOCUMENT ${docNumber} OF ${totalDocs}`;
  page.drawText(docText, {
    x: width / 2 - (docText.length * 3),
    y: yPosition,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  // Bottom separator
  page.drawText(separator, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
}

// Helper function to append PDF using pdf-lib
async function appendPDFToPDFLib(mainPdfDoc, pdfPath) {
  try {
    const pdfBytes = fs.readFileSync(pdfPath);
    const externalPdf = await PDFLibDocument.load(pdfBytes);
    const copiedPages = await mainPdfDoc.copyPages(externalPdf, externalPdf.getPageIndices());
    
    copiedPages.forEach((page) => {
      mainPdfDoc.addPage(page);
    });
    
    return true;
  } catch (error) {
    console.error('Error appending PDF:', error);
    return false;
  }
}

// Helper function to append image using pdf-lib
async function appendImageToPDFLib(pdfDoc, imagePath) {
  try {
    const imageBytes = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    
    let image;
    if (ext === '.jpg' || ext === '.jpeg') {
      image = await pdfDoc.embedJpg(imageBytes);
    } else if (ext === '.png') {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      return false;
    }
    
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    // Calculate dimensions to fit image on page with margins
    const maxWidth = width - 100;
    const maxHeight = height - 100;
    
    const imgDims = image.scale(1);
    let imgWidth = imgDims.width;
    let imgHeight = imgDims.height;
    
    // Scale to fit
    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const widthRatio = maxWidth / imgWidth;
      const heightRatio = maxHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio);
      
      imgWidth = imgWidth * ratio;
      imgHeight = imgHeight * ratio;
    }
    
    // Center the image
    const x = (width - imgWidth) / 2;
    const y = (height - imgHeight) / 2;
    
    page.drawImage(image, {
      x: x,
      y: y,
      width: imgWidth,
      height: imgHeight,
    });
    
    return true;
  } catch (error) {
    console.error('Error appending image:', error);
    return false;
  }
}

// Helper function to handle DOC/DOCX (placeholder page)
async function appendDocPlaceholderToPDFLib(pdfDoc, docPath) {
  try {
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const fileName = path.basename(docPath);
    const text1 = `[Document: ${fileName}]`;
    const text2 = 'Note: DOC/DOCX files are included in their original format in the ZIP.';
    const text3 = 'Please refer to the module folders for the original document.';
    
    page.drawText(text1, {
      x: width / 2 - (text1.length * 3),
      y: height / 2 + 20,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(text2, {
      x: 50,
      y: height / 2 - 20,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    page.drawText(text3, {
      x: 50,
      y: height / 2 - 40,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    return true;
  } catch (error) {
    console.error('Error creating DOC placeholder:', error);
    return false;
  }
}

exports.generateZipOnly = async (req, res) => {
  try {
    const { termId } = req.params;
    const { selectedFields } = req.body; // Array of selected module keys
    const facultyId = req.user.id;
    
    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);
    
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    // Helper function to check if a module should be included
    const shouldIncludeModule = (moduleKey) => {
      if (!selectedFields || selectedFields.length === 0) {
        return true; // Include all if no selection (Select All)
      }
      return selectedFields.includes(moduleKey);
    };

    // Map frontend keys to backend module names
    const keyMapping = {
      'fciScores': 'FCI_Score',
      'journalPapers': 'Journal_Papers',
      'conferencePapers': 'Conference_Papers',
      'nonIndexedPublications': 'NonIndexed_Publications',
      'books': 'Books_Chapters',
      'disclosures': 'Disclosures',
      'patents': 'Patents',
      'ugGuidance': 'UG_Guidance',
      'mastersGuidance': 'Masters_Guidance',
      'phdGuidance': 'PhD_Guidance',
      'fundedProjects': 'Funded_Projects',
      'consultingProjects': 'Consulting_Projects',
      'reviewerRoles': 'Reviewer_Roles',
      'fdpOrganized': 'FDP_Organized',
      'invitedTalks': 'Invited_Talks',
      'eventsOutside': 'Events_Outside',
      'eventsInside': 'Events_Inside',
      'industryRelations': 'Industry_Relations',
      'institutionalServices': 'Institutional_Services',
      'otherServices': 'Other_Services',
      'awards': 'Awards',
      'professionalism': 'Professionalism',
      'otherContributions': 'Other_Contributions'
    };
    
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
    let selectedModulesCount = 0;
    const documentList = []; // For summary table
    const documentsToProcess = []; // For consolidated PDF
    
    // First pass: collect all documents and add to ZIP folders
    for (const config of MODULE_CONFIG) {
      // Check if this module should be included based on selection
      const frontendKey = Object.keys(keyMapping).find(key => keyMapping[key] === config.name);
      if (!shouldIncludeModule(frontendKey)) {
        continue; // Skip this module
      }
      
      selectedModulesCount++;
      
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
                    
                    // Add to ZIP folder structure (existing behavior)
                    archive.file(absolutePath, { name: `${config.folder}/${fileName}` });
                    totalFiles++;
                    
                    // Track for PrintablePDF
                    const fileType = extension.toUpperCase().replace('.', '');
                    documentList.push({
                      module: config.name.replace(/_/g, ' '),
                      fileName: fileName,
                      fileType: fileType,
                      included: 'Yes'
                    });
                    
                    documentsToProcess.push({
                      moduleName: config.name.replace(/_/g, ' '),
                      fileName: fileName,
                      filePath: absolutePath,
                      fileType: fileType,
                      order: config.order
                    });
                    
                    fileIndex++;
                    console.log(`  ✓ Added: ${fileName}`);
                  } else {
                    console.warn(`  ✗ File not found: ${absolutePath}`);
                    documentList.push({
                      module: config.name.replace(/_/g, ' '),
                      fileName: doc.fileName || 'Unknown',
                      fileType: 'N/A',
                      included: 'No'
                    });
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
    
    // Generate PrintablePDF.pdf
    if (totalFiles > 0) {
      try {
        console.log('Generating PrintablePDF.pdf...');
        
        // Create consolidated PDF using pdf-lib
        const consolidatedPdf = await PDFLibDocument.create();
        
        // Step 1: Create summary page using PDFKit (for complex layout)
        const summaryPdfDoc = new PDFDocument({ size: 'A4', margin: 50 });
        const summaryChunks = [];
        
        summaryPdfDoc.on('data', chunk => summaryChunks.push(chunk));
        
        const summaryPromise = new Promise((resolve, reject) => {
          summaryPdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(summaryChunks);
            resolve(pdfBuffer);
          });
          summaryPdfDoc.on('error', reject);
        });
        
        // Generate summary page
        createSummaryPage(
          summaryPdfDoc,
          faculty.name,
          term.termName,
          selectedModulesCount,
          documentList,
          totalFiles
        );
        
        summaryPdfDoc.end();
        const summaryBuffer = await summaryPromise;
        
        // Load summary into consolidated PDF
        const summaryPdf = await PDFLibDocument.load(summaryBuffer);
        const summaryPages = await consolidatedPdf.copyPages(summaryPdf, summaryPdf.getPageIndices());
        summaryPages.forEach(page => consolidatedPdf.addPage(page));
        
        console.log('✓ Summary page added');
        
        // Step 2: Process documents in order
        let docNumber = 1;
        for (const docInfo of documentsToProcess) {
          try {
            console.log(`Processing document ${docNumber}/${totalFiles}: ${docInfo.fileName}`);
            
            // Add separator page
            await createSeparatorPagePDFLib(
              consolidatedPdf,
              docInfo.moduleName,
              docInfo.fileName,
              docNumber,
              totalFiles
            );
            
            // Append document based on type
            const ext = path.extname(docInfo.filePath).toLowerCase();
            let success = false;
            
            if (ext === '.pdf') {
              success = await appendPDFToPDFLib(consolidatedPdf, docInfo.filePath);
            } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
              success = await appendImageToPDFLib(consolidatedPdf, docInfo.filePath);
            } else if (ext === '.doc' || ext === '.docx') {
              success = await appendDocPlaceholderToPDFLib(consolidatedPdf, docInfo.filePath);
            } else {
              // Unsupported type - add placeholder
              const page = consolidatedPdf.addPage([595, 842]);
              const font = await consolidatedPdf.embedFont(StandardFonts.Helvetica);
              page.drawText(`[Unsupported file type: ${ext}]`, {
                x: 200,
                y: 400,
                size: 12,
                font: font,
              });
              success = true;
            }
            
            if (success) {
              console.log(`  ✓ Successfully processed: ${docInfo.fileName}`);
            } else {
              console.warn(`  ✗ Failed to process: ${docInfo.fileName}`);
            }
            
            docNumber++;
          } catch (error) {
            console.error(`Error processing document ${docInfo.fileName}:`, error);
            // Continue with next document
          }
        }
        
        // Save consolidated PDF
        const consolidatedPdfBytes = await consolidatedPdf.save();
        
        // Add PrintablePDF.pdf to ZIP root
        archive.append(Buffer.from(consolidatedPdfBytes), { name: 'PrintablePDF.pdf' });
        console.log('✓ PrintablePDF.pdf added to ZIP root');
        
      } catch (error) {
        console.error('Error generating PrintablePDF:', error);
        // Continue with ZIP generation even if PDF fails
      }
    }
    
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
