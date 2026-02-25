const PDFDocument = require('pdfkit');

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
 * Generate Professional PDF Report
 * GET /api/generate-pdf-report/:termId
 */
exports.generatePDFReport = async (req, res) => {
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
    
    // Create PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    
    // Set response headers
    const pdfFileName = `${faculty.name.replace(/\s+/g, '_')}_${term.termName.replace(/\s+/g, '_')}_Report.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('RAMAIAH INSTITUTE OF TECHNOLOGY', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text('Faculty Appraisal Report', { align: 'center' });
    doc.moveDown(1);
    
    // Faculty Info
    doc.fontSize(10).font('Helvetica-Bold').text(`Name: ${faculty.name}`);
    doc.font('Helvetica').text(`Department: ${faculty.department}`);
    doc.text(`Term: ${term.termName} (${term.academicYear})`);
    doc.moveDown(1.5);
    
    // Table configuration
    const tableTop = doc.y;
    const colWidths = [30, 280, 200, 40];
    const rowHeight = 20;
    
    // Draw table header
    const drawTableHeader = (y) => {
      doc.rect(40, y, colWidths[0], rowHeight).stroke();
      doc.rect(70, y, colWidths[1], rowHeight).stroke();
      doc.rect(350, y, colWidths[2], rowHeight).stroke();
      doc.rect(550, y, colWidths[3], rowHeight).stroke();
      
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Sl', 45, y + 6, { width: colWidths[0] - 10, align: 'center' });
      doc.text('Scoring Category', 75, y + 6, { width: colWidths[1] - 10 });
      doc.text('Detailed Information', 355, y + 6, { width: colWidths[2] - 10 });
      doc.text('App', 555, y + 6, { width: colWidths[3] - 10, align: 'center' });
    };
    
    drawTableHeader(tableTop);
    let currentY = tableTop + rowHeight;
    
    // Categories with their data
    const categories = [
      { num: 1, title: 'FCI Score (Average of all courses handled)', key: 'fciScores', field: 'score' },
      { num: 2, title: 'No. of new paid refereed journal papers in SJR*', key: 'journalPapers', field: 'title' },
      { num: 3, title: 'No. of indexed conference papers in SJR', key: 'conferencePapers', field: 'title' },
      { num: 4, title: 'No. of new paid non refereed journals and non indexed conferences', key: 'nonIndexedPublications', field: 'title' },
      { num: 5, title: 'Books/chapters', key: 'books', field: 'title' },
      { num: 6, title: 'Disclosures Filed', key: 'disclosures', field: 'title' },
      { num: 7, title: 'Patents Granted*', key: 'patents', field: 'title' },
      { num: 8, title: 'Research Guidance UG', key: 'ugGuidance', field: 'studentName' },
      { num: 9, title: 'Research Guidance PG', key: 'mastersGuidance', field: 'studentName' },
      { num: 10, title: 'Research Guidance PhD', key: 'phdGuidance', field: 'studentName' },
      { num: 11, title: 'Funded Projects*', key: 'fundedProjects', field: 'projectTitle' },
      { num: 12, title: 'Consulting Projects*', key: 'consultingProjects', field: 'projectTitle' },
      { num: 13, title: 'No. of Conference Chair, Session Chair, Reviewer of Q1 or Q2 Journal', key: 'reviewerRoles', field: 'venue' },
      { num: 14, title: 'No. of FDP/ Seminar/ Workshop organized as co-ordinator', key: 'fdpOrganized', field: 'eventName' },
      { num: 15, title: 'No. of invited technical talks outside the institute', key: 'invitedTalks', field: 'title' },
      { num: 16, title: 'No. of events participation outside the institute', key: 'eventsOutside', field: 'eventName' },
      { num: 17, title: 'No. of events participation inside the institute (FDP/Seminar/Workshop/Conferences)', key: 'eventsInside', field: 'eventName' },
      { num: 18, title: 'Industry Relations (MoU, Technical Talk, Invited Lecture, Technical Talk, Seminar)', key: 'industryRelations', field: 'organization' },
      { num: 19, title: 'Other Services to institution or society as NBA/NIRF', key: 'institutionalServices', field: 'serviceName' },
      { num: 20, title: 'Other Services to institution or society', key: 'otherServices', field: 'serviceName' },
      { num: 21, title: 'Awards and Honours', key: 'awards', field: 'awardName' },
      { num: 22, title: 'Professionalism / Team spirit', key: 'professionalism', field: 'rating' },
      { num: 23, title: 'Any other major contributions', key: 'otherContributions', field: 'title' }
    ];
    
    categories.forEach((category) => {
      const data = appraisalData[category.key] || [];
      const hasData = data.length > 0;
      const detailedInfo = hasData ? data.map((item, idx) => `${idx + 1}. ${item[category.field] || 'N/A'}`).join('\n') : 'NA';
      const appendix = hasData && data.some(item => item.filePath) ? 'Y' : 'NA';
      
      // Check if we need a new page
      const estimatedHeight = Math.max(rowHeight, Math.ceil(detailedInfo.length / 50) * 15);
      if (currentY + estimatedHeight > 750) {
        doc.addPage();
        currentY = 40;
        drawTableHeader(currentY);
        currentY += rowHeight;
      }
      
      const startY = currentY;
      
      // Draw cells
      doc.rect(40, startY, colWidths[0], estimatedHeight).stroke();
      doc.rect(70, startY, colWidths[1], estimatedHeight).stroke();
      doc.rect(350, startY, colWidths[2], estimatedHeight).stroke();
      doc.rect(550, startY, colWidths[3], estimatedHeight).stroke();
      
      // Fill content
      doc.fontSize(8).font('Helvetica');
      doc.text(category.num.toString(), 45, startY + 5, { width: colWidths[0] - 10, align: 'center' });
      doc.text(category.title, 75, startY + 5, { width: colWidths[1] - 10 });
      doc.text(detailedInfo, 355, startY + 5, { width: colWidths[2] - 10 });
      doc.text(appendix, 555, startY + 5, { width: colWidths[3] - 10, align: 'center' });
      
      currentY += estimatedHeight;
    });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ 
      message: 'Error generating PDF report', 
      error: error.message 
    });
  }
};

module.exports = exports;
