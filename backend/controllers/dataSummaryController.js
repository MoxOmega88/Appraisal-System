/**
 * Data Summary Report Controller
 * Generates comprehensive PDF with ALL database fields in TABLE format
 */

const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Term = require('../models/Term');

// Import all models
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

const generateDataSummary = async (req, res) => {
  try {
    const { termId } = req.params;
    const { selectedFields } = req.body; // This now contains selected MODULE keys, not field keys
    const facultyId = req.user._id;

    // Fetch user and term info
    const user = await User.findById(facultyId);
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

    // Helper function to check if any module in a section should be included
    const shouldIncludeSection = (moduleKeys) => {
      if (!selectedFields || selectedFields.length === 0) {
        return true; // Include all sections if Select All
      }
      return moduleKeys.some(key => selectedFields.includes(key));
    };

    // Fetch ALL data from ALL modules
    const [
      fciScores,
      journalPapers,
      conferencePapers,
      nonIndexedPublications,
      books,
      disclosures,
      patents,
      ugGuidance,
      mastersGuidance,
      phdGuidance,
      fundedProjects,
      consultingProjects,
      reviewerRoles,
      fdpOrganized,
      invitedTalks,
      eventsOutside,
      eventsInside,
      industryRelations,
      institutionalServices,
      otherServices,
      awards,
      professionalism,
      otherContributions
    ] = await Promise.all([
      FCIScore.find({ facultyId, termId }).lean(),
      JournalPaper.find({ facultyId, termId }).lean(),
      ConferencePaper.find({ facultyId, termId }).lean(),
      NonIndexedPublication.find({ facultyId, termId }).lean(),
      Book.find({ facultyId, termId }).lean(),
      Disclosure.find({ facultyId, termId }).lean(),
      Patent.find({ facultyId, termId }).lean(),
      UGGuidance.find({ facultyId, termId }).lean(),
      MastersGuidance.find({ facultyId, termId }).lean(),
      PhDGuidance.find({ facultyId, termId }).lean(),
      FundedProject.find({ facultyId, termId }).lean(),
      ConsultingProject.find({ facultyId, termId }).lean(),
      ReviewerRole.find({ facultyId, termId }).lean(),
      FDPOrganized.find({ facultyId, termId }).lean(),
      InvitedTalk.find({ facultyId, termId }).lean(),
      EventOutside.find({ facultyId, termId }).lean(),
      EventInside.find({ facultyId, termId }).lean(),
      IndustryRelation.find({ facultyId, termId }).lean(),
      InstitutionalService.find({ facultyId, termId }).lean(),
      OtherService.find({ facultyId, termId }).lean(),
      Award.find({ facultyId, termId }).lean(),
      Professionalism.find({ facultyId, termId }).lean(),
      OtherContribution.find({ facultyId, termId }).lean()
    ]);

    // Create PDF
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 30,
      bufferPages: true,
      layout: 'landscape' // Landscape for better table width
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Faculty_Data_Summary_${term.termName.replace(/\s+/g, '_')}.pdf`
    );

    doc.pipe(res);

    // Helper function to format date
    const formatDate = (date) => {
      if (!date) return 'N/A';
      const d = new Date(date);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    // Helper function to format value
    const formatValue = (value, type = 'text') => {
      if (value === null || value === undefined || value === '') return 'N/A';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      
      if (Array.isArray(value)) {
        if (value.length === 0) return 'N/A';
        
        // Handle documents array
        if (value[0] && value[0].fileName) {
          return value.map(doc => doc.originalName || doc.fileName).join('\n');
        }
        
        // Handle students/scholars array
        if (value[0] && typeof value[0] === 'object') {
          return value.map((item, idx) => {
            const parts = [];
            if (item.name) parts.push(item.name);
            if (item.usn) parts.push(`(${item.usn})`);
            return parts.join(' ');
          }).join('\n');
        }
        
        return value.join(', ');
      }
      
      if (type === 'date') {
        return formatDate(value);
      }
      
      return String(value);
    };

    // Helper function to draw table
    const drawTable = (title, data, columns, startY) => {
      const pageWidth = doc.page.width - 60; // margins
      const tableTop = startY || doc.y;
      const rowHeight = 35; // Increased from 25
      const headerHeight = 40; // Increased from 30
      
      // Add S.No. column width
      const snoWidth = 50;
      const remainingWidth = pageWidth - snoWidth;
      const colWidth = remainingWidth / columns.length;

      // Check if we need a new page
      if (tableTop > doc.page.height - 100) {
        doc.addPage();
        return drawTable(title, data, columns, 50);
      }

      // Draw section title with underline
      doc.fontSize(13).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text(title, 30, tableTop);
      
      // Draw underline
      const titleWidth = doc.widthOfString(title);
      doc.moveTo(30, tableTop + 16)
         .lineTo(30 + titleWidth, tableTop + 16)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      
      doc.moveDown(1);

      const currentY = doc.y;

      // If no data
      if (!data || data.length === 0) {
        doc.fontSize(10).fillColor('#666666').font('Helvetica-Oblique');
        doc.text('No records available', 30, currentY);
        doc.moveDown(2);
        return doc.y;
      }

      const totalWidth = snoWidth + remainingWidth;

      // Draw table header
      let xPos = 30;
      doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold');
      
      // Header background with gradient effect (darker at top)
      doc.rect(30, currentY, totalWidth, headerHeight).fill('#1a237e');
      
      // S.No. header
      doc.fillColor('#ffffff');
      doc.text('S.No.', xPos, currentY + 12, {
        width: snoWidth,
        align: 'center'
      });
      xPos += snoWidth;
      
      // Column headers WITHOUT numbering
      columns.forEach((col) => {
        doc.fillColor('#ffffff');
        const text = col.label;
        doc.text(text, xPos, currentY + 12, {
          width: colWidth,
          align: 'center'
        });
        xPos += colWidth;
      });

      // Draw table rows
      let yPos = currentY + headerHeight;
      doc.font('Helvetica').fontSize(8);

      data.forEach((record, rowIndex) => {
        // Check if we need a new page
        if (yPos > doc.page.height - 50) {
          doc.addPage();
          yPos = 50;
          
          // Redraw header on new page
          xPos = 30;
          doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold');
          doc.rect(30, yPos, totalWidth, headerHeight).fill('#1a237e');
          
          // S.No. header
          doc.fillColor('#ffffff');
          doc.text('S.No.', xPos, yPos + 12, {
            width: snoWidth,
            align: 'center'
          });
          xPos += snoWidth;
          
          columns.forEach((col) => {
            doc.fillColor('#ffffff');
            const text = col.label;
            doc.text(text, xPos, yPos + 12, {
              width: colWidth,
              align: 'center'
            });
            xPos += colWidth;
          });
          
          yPos += headerHeight;
          doc.font('Helvetica').fontSize(8);
        }

        // Alternate row colors with better contrast
        const rowColor = rowIndex % 2 === 0 ? '#f8f9fa' : '#ffffff';
        doc.rect(30, yPos, totalWidth, rowHeight).fill(rowColor);

        // Draw S.No. cell
        xPos = 30;
        doc.rect(xPos, yPos, snoWidth, rowHeight).stroke('#dee2e6');
        doc.fillColor('#495057').font('Helvetica-Bold');
        doc.text(String(rowIndex + 1), xPos, yPos + 12, {
          width: snoWidth,
          align: 'center'
        });
        xPos += snoWidth;
        
        doc.font('Helvetica').fontSize(8);
        // Draw data cells
        columns.forEach((col) => {
          // Cell border with lighter color
          doc.rect(xPos, yPos, colWidth, rowHeight).stroke('#dee2e6');
          
          // Cell content
          let cellValue = record[col.key];
          
          if (col.type === 'date') {
            cellValue = formatDate(cellValue);
          } else if (col.type === 'array' || col.type === 'documents') {
            cellValue = formatValue(cellValue, col.type);
          } else {
            cellValue = formatValue(cellValue);
          }

          // Text color - darker for better readability
          doc.fillColor('#212529');
          
          // Center align for numbers, left align for text
          const align = (col.type === 'number' && !isNaN(cellValue) && cellValue !== 'N/A') ? 'center' : 'left';
          const xOffset = align === 'center' ? 0 : 8;
          
          doc.text(cellValue, xPos + xOffset, yPos + 12, {
            width: colWidth - 16,
            height: rowHeight - 10,
            align: align,
            ellipsis: true
          });

          xPos += colWidth;
        });

        yPos += rowHeight;
      });

      doc.y = yPos + 15;
      return doc.y;
    };

    // Title Page with better styling
    doc.fontSize(24).fillColor('#1a237e').font('Helvetica-Bold');
    doc.text('Faculty Appraisal Data Summary', { align: 'center' });
    
    // Decorative line under title
    doc.moveTo(200, doc.y + 5)
       .lineTo(doc.page.width - 200, doc.y + 5)
       .lineWidth(3)
       .strokeColor('#1a237e')
       .stroke();
    
    doc.moveDown(1.5);
    
    doc.fontSize(11).fillColor('#495057').font('Helvetica');
    doc.text(`Faculty: ${user.name}`, { align: 'center' });
    doc.fontSize(10).fillColor('#6c757d');
    doc.text(`Employee ID: ${user.employeeId}`, { align: 'center' });
    doc.text(`Department: ${user.department}`, { align: 'center' });
    doc.moveDown(0.8);
    doc.fontSize(11).fillColor('#495057').font('Helvetica-Bold');
    doc.text(`Term: ${term.termName} (${term.academicYear})`, { align: 'center' });
    doc.fontSize(10).fillColor('#6c757d').font('Helvetica');
    doc.text(`Period: ${formatDate(term.startDate)} to ${formatDate(term.endDate)}`, { align: 'center' });
    doc.moveDown(3);

    // Section 1: Teaching & Learning
    if (shouldIncludeSection(['fciScores'])) {
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 1: TEACHING & LEARNING');
      
      // Section underline
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      
      doc.moveDown(2);

      if (shouldIncludeModule('fciScores')) {
        drawTable('FCI Score', fciScores, [
          { key: 'averageScore', label: 'Average Score', type: 'number' },
          { key: 'numberOfCourses', label: 'No. of Courses', type: 'number' },
          { key: 'remarks', label: 'Remarks', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 2: Research Publications
    if (shouldIncludeSection(['journalPapers', 'conferencePapers', 'nonIndexedPublications', 'books'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 2: RESEARCH PUBLICATIONS');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('journalPapers')) {
        drawTable('1. Journal Papers', journalPapers, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'journalName', label: 'Journal Name', type: 'text' },
          { key: 'indexedIn', label: 'Indexed In', type: 'text' },
          { key: 'quartile', label: 'Quartile', type: 'text' },
          { key: 'authorPosition', label: 'Author Pos.', type: 'number' },
          { key: 'publicationDate', label: 'Pub. Date', type: 'date' },
          { key: 'doi', label: 'DOI', type: 'text' },
          { key: 'proofUrl', label: 'Proof URL', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('conferencePapers')) {
        drawTable('2. Conference Papers', conferencePapers, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'conferenceName', label: 'Conference Name', type: 'text' },
          { key: 'quartile', label: 'Quartile', type: 'text' },
          { key: 'authorPosition', label: 'Author Pos.', type: 'number' },
          { key: 'publicationDate', label: 'Pub. Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('nonIndexedPublications')) {
        drawTable('3. Non-Indexed Publications', nonIndexedPublications, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'authorPosition', label: 'Author Pos.', type: 'number' },
          { key: 'publicationDate', label: 'Pub. Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('books')) {
        drawTable('4. Books / Book Chapters', books, [
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'authorPosition', label: 'Author Pos.', type: 'number' },
          { key: 'publisher', label: 'Publisher', type: 'text' },
          { key: 'publicationYear', label: 'Year', type: 'number' },
          { key: 'isbn', label: 'ISBN', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 3: Intellectual Property
    if (shouldIncludeSection(['disclosures', 'patents'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 3: INTELLECTUAL PROPERTY');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('disclosures')) {
        drawTable('5. Disclosures Filed', disclosures, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'filingDate', label: 'Filing Date', type: 'date' },
          { key: 'applicationNumber', label: 'Application No.', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('patents')) {
        drawTable('6. Patents Granted', patents, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'patentNumber', label: 'Patent No.', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' },
          { key: 'grantDate', label: 'Grant Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 4: Research Guidance
    if (shouldIncludeSection(['ugGuidance', 'mastersGuidance', 'phdGuidance'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 4: RESEARCH GUIDANCE');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('ugGuidance')) {
        drawTable('7. UG Research Guidance', ugGuidance, [
          { key: 'numberOfStudents', label: 'No. of Students', type: 'number' },
          { key: 'students', label: 'Students', type: 'array' },
          { key: 'projectTitle', label: 'Project Title', type: 'text' },
          { key: 'remarks', label: 'Remarks', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('mastersGuidance')) {
        drawTable("8. Master's Research Guidance", mastersGuidance, [
          { key: 'numberOfStudents', label: 'No. of Students', type: 'number' },
          { key: 'students', label: 'Students', type: 'array' },
          { key: 'thesisTitle', label: 'Thesis Title', type: 'text' },
          { key: 'remarks', label: 'Remarks', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('phdGuidance')) {
        drawTable('9. PhD Research Guidance', phdGuidance, [
          { key: 'numberOfScholars', label: 'No. of Scholars', type: 'number' },
          { key: 'scholars', label: 'Scholars', type: 'array' },
          { key: 'researchArea', label: 'Research Area', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 5: Projects
    if (shouldIncludeSection(['fundedProjects', 'consultingProjects'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 5: PROJECTS');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('fundedProjects')) {
        drawTable('10. Funded Projects', fundedProjects, [
          { key: 'title', label: 'Project Title', type: 'text' },
          { key: 'fundingAmount', label: 'Amount', type: 'number' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'fundingAgency', label: 'Agency', type: 'text' },
          { key: 'startDate', label: 'Start Date', type: 'date' },
          { key: 'endDate', label: 'End Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('consultingProjects')) {
        drawTable('11. Consulting Projects', consultingProjects, [
          { key: 'title', label: 'Project Title', type: 'text' },
          { key: 'amount', label: 'Amount', type: 'number' },
          { key: 'clientName', label: 'Client Name', type: 'text' },
          { key: 'completionDate', label: 'Completion Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 6: Professional Activities
    if (shouldIncludeSection(['reviewerRoles', 'fdpOrganized'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 6: PROFESSIONAL ACTIVITIES');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('reviewerRoles')) {
        drawTable('12. Reviewer Roles', reviewerRoles, [
          { key: 'roleType', label: 'Role Type', type: 'text' },
          { key: 'venueName', label: 'Venue Name', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'quartile', label: 'Quartile', type: 'text' },
          { key: 'conferenceDetails', label: 'Conf. Details', type: 'text' },
          { key: 'month', label: 'Month', type: 'number' },
          { key: 'year', label: 'Year', type: 'number' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('fdpOrganized')) {
        drawTable('13. FDP/Events Organized', fdpOrganized, [
          { key: 'eventTitle', label: 'Event Title', type: 'text' },
          { key: 'startDate', label: 'Start Date', type: 'date' },
          { key: 'endDate', label: 'End Date', type: 'date' },
          { key: 'durationCategory', label: 'Duration (Days)', type: 'number' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 7: Lectures & Events
    if (shouldIncludeSection(['invitedTalks', 'eventsOutside', 'eventsInside'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 7: LECTURES & EVENTS');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('invitedTalks')) {
        drawTable('14. Invited Talks', invitedTalks, [
          { key: 'title', label: 'Talk Title', type: 'text' },
          { key: 'organization', label: 'Organization', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('eventsOutside')) {
        drawTable('15. Events Outside Institute', eventsOutside, [
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'eventName', label: 'Event Name', type: 'text' },
          { key: 'organization', label: 'Organization', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('eventsInside')) {
        drawTable('16. Events Inside Institute', eventsInside, [
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'eventName', label: 'Event Name', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 8: Relations & Services
    if (shouldIncludeSection(['industryRelations', 'institutionalServices', 'otherServices'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 8: RELATIONS & SERVICES');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('industryRelations')) {
        drawTable('17. Industry Relations', industryRelations, [
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'companyName', label: 'Company Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('institutionalServices')) {
        drawTable('18. Institutional Services', institutionalServices, [
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'serviceName', label: 'Service Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('otherServices')) {
        drawTable('19. Other Services', otherServices, [
          { key: 'serviceName', label: 'Service Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // Section 9: Recognition
    if (shouldIncludeSection(['awards', 'professionalism', 'otherContributions'])) {
      doc.addPage();
      doc.fontSize(16).fillColor('#1a237e').font('Helvetica-Bold');
      doc.text('SECTION 9: RECOGNITION');
      doc.moveTo(30, doc.y + 3)
         .lineTo(doc.page.width - 30, doc.y + 3)
         .lineWidth(2)
         .strokeColor('#1a237e')
         .stroke();
      doc.moveDown(2);

      if (shouldIncludeModule('awards')) {
        drawTable('20. Awards & Honours', awards, [
          { key: 'title', label: 'Award Title', type: 'text' },
          { key: 'issuingBody', label: 'Issuing Body', type: 'text' },
          { key: 'date', label: 'Award Date', type: 'date' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('professionalism')) {
        drawTable('21. Professionalism / Team Spirit', professionalism, [
          { key: 'activityName', label: 'Activity Name', type: 'text' },
          { key: 'remarks', label: 'Remarks', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }

      if (shouldIncludeModule('otherContributions')) {
        drawTable('22. Other Major Contributions', otherContributions, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'documents', label: 'Documents', type: 'documents' }
        ]);
      }
    }

    // End document to finalize page count
    doc.flushPages();

    // Footer with better styling - only on actual pages
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      // Footer line
      doc.moveTo(30, doc.page.height - 35)
         .lineTo(doc.page.width - 30, doc.page.height - 35)
         .lineWidth(0.5)
         .strokeColor('#dee2e6')
         .stroke();
      
      doc.fontSize(7).fillColor('#6c757d').font('Helvetica');
      doc.text(
        `Page ${i + 1} of ${pages.count} | Generated on ${new Date().toLocaleString()}`,
        30,
        doc.page.height - 25,
        { align: 'center', width: doc.page.width - 60 }
      );
    }

    doc.end();
  } catch (error) {
    console.error('Data summary generation error:', error);
    res.status(500).json({ 
      message: 'Error generating data summary', 
      error: error.message 
    });
  }
};

module.exports = { generateDataSummary };
