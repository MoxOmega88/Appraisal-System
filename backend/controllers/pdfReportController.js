const PDFDocument = require('pdfkit');

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

exports.generatePDFReport = async (req, res) => {
  try {
    const { termId } = req.params;
    const facultyId = req.user.id;
    
    const faculty = await User.findById(facultyId);
    const term = await Term.findById(termId);
    
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    
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
    
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    const pdfFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Report.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    
    doc.pipe(res);
    
    // Header - more compact
    doc.fontSize(14).font('Helvetica-Bold').text('RAMAIAH INSTITUTE OF TECHNOLOGY', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').text('Faculty Appraisal Report', { align: 'center' });
    doc.moveDown(0.8);
    
    // Faculty Info - single line
    doc.fontSize(9).font('Helvetica').text(`Name: ${faculty.name}  |  Department: ${faculty.department}  |  Term: ${term.termName} (${term.academicYear})`, { align: 'center' });
    doc.moveDown(0.8);
    
    const colWidths = [30, 200, 280, 30];
    
    const drawTableHeader = (y) => {
      doc.rect(30, y, colWidths[0], 18).stroke();
      doc.rect(60, y, colWidths[1], 18).stroke();
      doc.rect(260, y, colWidths[2], 18).stroke();
      doc.rect(540, y, colWidths[3], 18).stroke();
      
      doc.fontSize(8).font('Helvetica-Bold');
      doc.text('Sl', 32, y + 6, { width: colWidths[0] - 4, align: 'center' });
      doc.text('Scoring Category', 65, y + 6, { width: colWidths[1] - 10 });
      doc.text('Detailed Information', 265, y + 6, { width: colWidths[2] - 10 });
      doc.text('App', 542, y + 6, { width: colWidths[3] - 4, align: 'center' });
    };
    
    let currentY = doc.y;
    drawTableHeader(currentY);
    currentY += 18;
    
    const categories = [
      { num: 1, title: 'FCI Score', key: 'fciScores', field: 'score' },
      { num: 2, title: 'Refereed Journal Papers', key: 'journalPapers', field: 'title' },
      { num: 3, title: 'Indexed Conference Papers', key: 'conferencePapers', field: 'title' },
      { num: 4, title: 'Non-Indexed Publications', key: 'nonIndexedPublications', field: 'title' },
      { num: 5, title: 'Books/Chapters', key: 'books', field: 'title' },
      { num: 6, title: 'Disclosures Filed', key: 'disclosures', field: 'title' },
      { num: 7, title: 'Patents Granted', key: 'patents', field: 'title' },
      { num: 8, title: 'UG Research Guidance', key: 'ugGuidance', field: 'studentName' },
      { num: 9, title: 'PG Research Guidance', key: 'mastersGuidance', field: 'studentName' },
      { num: 10, title: 'PhD Research Guidance', key: 'phdGuidance', field: 'studentName' },
      { num: 11, title: 'Funded Projects', key: 'fundedProjects', field: 'title' },
      { num: 12, title: 'Consulting Projects', key: 'consultingProjects', field: 'title' },
      { num: 13, title: 'Conference/Reviewer Roles', key: 'reviewerRoles', field: 'venue' },
      { num: 14, title: 'FDP/Events Organized', key: 'fdpOrganized', field: 'eventName' },
      { num: 15, title: 'Invited Talks Outside', key: 'invitedTalks', field: 'title' },
      { num: 16, title: 'Events Outside Institute', key: 'eventsOutside', field: 'eventName' },
      { num: 17, title: 'Events Inside Institute', key: 'eventsInside', field: 'eventName' },
      { num: 18, title: 'Industry Relations', key: 'industryRelations', field: 'organization' },
      { num: 19, title: 'Institutional Services', key: 'institutionalServices', field: 'serviceName' },
      { num: 20, title: 'Other Services', key: 'otherServices', field: 'serviceName' },
      { num: 21, title: 'Awards and Honours', key: 'awards', field: 'awardName' },
      { num: 22, title: 'Professionalism', key: 'professionalism', field: 'activityName' },
      { num: 23, title: 'Other Contributions', key: 'otherContributions', field: 'title' }
    ];
    
    categories.forEach((category) => {
      const data = appraisalData[category.key] || [];
      const hasData = data.length > 0;
      
      // Helper function to check if date/year is within term range
      const isDateInTermRange = (item) => {
        const termStart = new Date(term.startDate);
        const termEnd = new Date(term.endDate);
        
        // Check for various date fields
        if (item.date) {
          const itemDate = new Date(item.date);
          return itemDate >= termStart && itemDate <= termEnd;
        }
        
        if (item.publicationDate) {
          const itemDate = new Date(item.publicationDate);
          return itemDate >= termStart && itemDate <= termEnd;
        }
        
        if (item.grantDate) {
          const itemDate = new Date(item.grantDate);
          return itemDate >= termStart && itemDate <= termEnd;
        }
        
        if (item.startDate) {
          const itemDate = new Date(item.startDate);
          return itemDate >= termStart && itemDate <= termEnd;
        }
        
        // Check for year field
        if (item.year) {
          const termStartYear = termStart.getFullYear();
          const termEndYear = termEnd.getFullYear();
          return item.year >= termStartYear && item.year <= termEndYear;
        }
        
        // Check for publicationYear
        if (item.publicationYear) {
          const termStartYear = termStart.getFullYear();
          const termEndYear = termEnd.getFullYear();
          return item.publicationYear >= termStartYear && item.publicationYear <= termEndYear;
        }
        
        return true; // If no date field found, assume it's valid
      };
      
      // Helper function to get date/year string
      const getDateString = (item) => {
        if (item.date) {
          return new Date(item.date).toLocaleDateString('en-IN');
        }
        if (item.publicationDate) {
          return new Date(item.publicationDate).toLocaleDateString('en-IN');
        }
        if (item.grantDate) {
          return new Date(item.grantDate).toLocaleDateString('en-IN');
        }
        if (item.startDate) {
          return new Date(item.startDate).toLocaleDateString('en-IN');
        }
        if (item.year) {
          return item.year.toString();
        }
        if (item.publicationYear) {
          return item.publicationYear.toString();
        }
        return '';
      };
      
      const getDisplayValue = (item, categoryKey) => {
        let displayValue = '';
        
        // Special handling for FCI Score - show average score
        if (categoryKey === 'fciScores' && item.averageScore !== undefined) {
          displayValue = item.averageScore.toString();
        }
        // Special handling for Professionalism
        else if (categoryKey === 'professionalism') {
          const name = item.activityName || '';
          const remarks = item.remarks || '';
          if (name && remarks) displayValue = `${name} - ${remarks}`;
          else if (name) displayValue = name;
          else if (remarks) displayValue = remarks;
          else displayValue = 'N/A';
        }
        // Special handling for PhD Guidance - show research area
        else if (categoryKey === 'phdGuidance' && item.researchArea) {
          displayValue = item.researchArea;
        }
        // Special handling for Events - show event name
        else if ((categoryKey === 'eventsOutside' || categoryKey === 'eventsInside') && item.eventName) {
          displayValue = item.eventName;
        }
        else if (item.title) displayValue = item.title;
        else if (item.projectTitle) displayValue = item.projectTitle;
        else if (item.thesisTitle) displayValue = item.thesisTitle;
        else if (item.scholarName) displayValue = item.scholarName;
        else if (item.venueName) displayValue = item.venueName;
        else if (item.eventTitle) displayValue = item.eventTitle;
        else if (item.eventName) displayValue = item.eventName;
        else if (item.companyName) displayValue = item.companyName;
        else if (item.serviceName) displayValue = item.serviceName;
        else if (item.awardTitle) displayValue = item.awardTitle;
        else if (item.activityName) displayValue = item.activityName;
        else if (item.description) displayValue = item.description;
        else if (item.researchArea) displayValue = item.researchArea;
        else displayValue = 'N/A';
        
        // Check if date is outside term range and append date/year
        if (!isDateInTermRange(item)) {
          const dateStr = getDateString(item);
          if (dateStr) {
            displayValue += ` [${dateStr}]`;
          }
        }
        
        return displayValue;
      };
      
      let detailedInfo = 'NA';
      let hasOutOfRangeEntries = false;
      
      if (hasData) {
        // Build detailed info with individual entries
        const entries = data.map((item, idx) => {
          const displayValue = getDisplayValue(item, category.key);
          const isOutOfRange = !isDateInTermRange(item) && getDateString(item);
          if (isOutOfRange) hasOutOfRangeEntries = true;
          return {
            text: `${idx + 1}. ${displayValue}`,
            isOutOfRange: isOutOfRange
          };
        });
        
        detailedInfo = entries.map(e => e.text).join(', ');
      }
      
      const appendix = hasData && data.some(item => item.documents && item.documents.length > 0) ? 'Y' : 'NA';
      
      // Calculate dynamic height based on content - more compact
      const lines = doc.heightOfString(detailedInfo, { width: colWidths[2] - 10 });
      const categoryLines = doc.heightOfString(category.title, { width: colWidths[1] - 10 });
      const rowHeight = Math.max(18, Math.ceil(Math.max(lines, categoryLines)) + 8);
      
      const startY = currentY;
      
      // Draw cell borders
      doc.rect(30, startY, colWidths[0], rowHeight).stroke();
      doc.rect(60, startY, colWidths[1], rowHeight).stroke();
      doc.rect(260, startY, colWidths[2], rowHeight).stroke();
      doc.rect(540, startY, colWidths[3], rowHeight).stroke();
      
      // Cell content - smaller fonts
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000');
      doc.text(category.num.toString(), 32, startY + 5, { width: colWidths[0] - 4, align: 'center' });
      
      doc.font('Helvetica').fillColor('#000000');
      doc.text(category.title, 65, startY + 5, { width: colWidths[1] - 10 });
      
      // Color the detailed info red if it has out of range entries
      doc.fontSize(6.5);
      if (hasData) {
        const entries = data.map((item, idx) => {
          const displayValue = getDisplayValue(item, category.key);
          const isOutOfRange = !isDateInTermRange(item) && getDateString(item);
          return {
            text: `${idx + 1}. ${displayValue}`,
            isOutOfRange: isOutOfRange
          };
        });
        
        let currentX = 265;
        let currentTextY = startY + 5;
        
        entries.forEach((entry, idx) => {
          const separator = idx > 0 ? ', ' : '';
          const fullText = separator + entry.text;
          
          // Set color based on whether entry is out of range
          doc.fillColor(entry.isOutOfRange ? '#dc2626' : '#000000');
          doc.text(fullText, currentX, currentTextY, { 
            width: colWidths[2] - 10,
            continued: idx < entries.length - 1
          });
        });
      } else {
        doc.fillColor('#000000');
        doc.text(detailedInfo, 265, startY + 5, { width: colWidths[2] - 10 });
      }
      
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000');
      doc.text(appendix, 542, startY + 5, { width: colWidths[3] - 4, align: 'center' });
      
      currentY += rowHeight;
    });
    
    // Add note about red highlighted entries
    doc.moveDown(1);
    doc.fontSize(7)
       .fillColor('#dc2626')
       .font('Helvetica-Bold')
       .text('Note: ', 30, currentY + 10, { continued: true })
       .fillColor('#000000')
       .font('Helvetica')
       .text('Entries highlighted in red with dates in brackets [date] are outside the selected term date range.', { width: 540 });
    
    // Add footer with generation date
    doc.fontSize(7).fillColor('#000000').text(
      `Generated on ${new Date().toLocaleDateString('en-IN')}`,
      30,
      780,
      { align: 'center', width: 540 }
    );
    
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error generating PDF report', 
        error: error.message 
      });
    }
  }
};

module.exports = exports;
