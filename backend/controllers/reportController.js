/**
 * Report Controller
 * Generates comprehensive PDF appraisal reports
 */

const PDFDocument = require('pdfkit');
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
const User = require('../models/User');

// @desc    Generate appraisal report for a term
// @route   GET /api/report/:termId
// @access  Private
const generateReport = async (req, res) => {
  try {
    const { termId } = req.params;
    
    // Fetch term details
    const term = await Term.findById(termId);
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    
    // Verify ownership
    if (term.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Fetch user details
    const user = await User.findById(req.user._id);
    
    // Fetch all appraisal data
    const [
      fciScores, journalPapers, conferencePapers, nonIndexedPubs,
      books, disclosures, patents, ugGuidance, mastersGuidance,
      phdGuidance, fundedProjects, consultingProjects, reviewerRoles,
      fdpOrganized, invitedTalks, eventsOutside, eventsInside,
      industryRelations, institutionalServices, otherServices,
      awards, professionalism, otherContributions
    ] = await Promise.all([
      FCIScore.find({ termId }),
      JournalPaper.find({ termId }),
      ConferencePaper.find({ termId }),
      NonIndexedPublication.find({ termId }),
      Book.find({ termId }),
      Disclosure.find({ termId }),
      Patent.find({ termId }),
      UGGuidance.find({ termId }),
      MastersGuidance.find({ termId }),
      PhDGuidance.find({ termId }),
      FundedProject.find({ termId }),
      ConsultingProject.find({ termId }),
      ReviewerRole.find({ termId }),
      FDPOrganized.find({ termId }),
      InvitedTalk.find({ termId }),
      EventOutside.find({ termId }),
      EventInside.find({ termId }),
      IndustryRelation.find({ termId }),
      InstitutionalService.find({ termId }),
      OtherService.find({ termId }),
      Award.find({ termId }),
      Professionalism.findOne({ termId }),
      OtherContribution.find({ termId })
    ]);
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=appraisal-report-${term.termName}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    addReportHeader(doc, user, term);
    addFCIScores(doc, fciScores);
    addPublications(doc, journalPapers, conferencePapers, nonIndexedPubs, books);
    addIPR(doc, disclosures, patents);
    addResearchGuidance(doc, ugGuidance, mastersGuidance, phdGuidance);
    addProjects(doc, fundedProjects, consultingProjects);
    addProfessionalActivities(doc, reviewerRoles, fdpOrganized, invitedTalks);
    addEvents(doc, eventsOutside, eventsInside);
    addIndustryAndServices(doc, industryRelations, institutionalServices, otherServices);
    addAwardsAndOthers(doc, awards, professionalism, otherContributions);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// Helper function: Add report header
function addReportHeader(doc, user, term) {
  doc.fontSize(20).font('Helvetica-Bold')
     .text('FACULTY APPRAISAL REPORT', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(12).font('Helvetica');
  doc.text(`Name: ${user.name}`, { continued: false });
  doc.text(`Employee ID: ${user.employeeId}`);
  doc.text(`Department: ${user.department}`);
  doc.text(`Designation: ${user.designation}`);
  doc.moveDown();
  
  doc.text(`Appraisal Period: ${term.termName}`);
  doc.text(`Duration: ${new Date(term.startDate).toLocaleDateString()} to ${new Date(term.endDate).toLocaleDateString()}`);
  doc.text(`Duration (Months): ${term.durationMonths}`);
  doc.moveDown(2);
  
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
}

// Helper function: Add FCI Scores
function addFCIScores(doc, fciScores) {
  doc.fontSize(14).font('Helvetica-Bold').text('1. FCI Score', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (fciScores.length > 0) {
    fciScores.forEach(score => {
      doc.text(`Average Score: ${score.averageScore} (${score.numberOfCourses} courses)`);
      if (score.remarks) doc.text(`Remarks: ${score.remarks}`);
    });
  } else {
    doc.text('No FCI scores recorded.');
  }
  doc.moveDown();
}

// Helper function: Add Publications
function addPublications(doc, journals, conferences, nonIndexed, books) {
  // Refereed Journals
  doc.fontSize(14).font('Helvetica-Bold').text('2. Refereed Journal Papers (SJR/Scopus/WoS)', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (journals.length > 0) {
    journals.forEach((paper, index) => {
      doc.text(`${index + 1}. ${paper.title}`);
      doc.text(`   Journal: ${paper.journalName} | Indexed: ${paper.indexedIn} | Position: ${paper.authorPosition}`, { indent: 20 });
    });
  } else {
    doc.text('No journal papers recorded.');
  }
  doc.moveDown();
  
  // Conferences
  doc.fontSize(14).font('Helvetica-Bold').text('3. Indexed Conference Papers', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (conferences.length > 0) {
    conferences.forEach((paper, index) => {
      doc.text(`${index + 1}. ${paper.title}`);
      doc.text(`   Conference: ${paper.conferenceName} | Position: ${paper.authorPosition}`, { indent: 20 });
    });
  } else {
    doc.text('No conference papers recorded.');
  }
  doc.moveDown();
  
  // Non-indexed
  doc.fontSize(14).font('Helvetica-Bold').text('4. Non-refereed Journals & Non-indexed Conferences', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (nonIndexed.length > 0) {
    nonIndexed.forEach((pub, index) => {
      doc.text(`${index + 1}. ${pub.title} (${pub.type})`);
    });
  } else {
    doc.text('No non-indexed publications recorded.');
  }
  doc.moveDown();
  
  // Books
  doc.fontSize(14).font('Helvetica-Bold').text('5. Books / Book Chapters', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (books.length > 0) {
    books.forEach((book, index) => {
      doc.text(`${index + 1}. ${book.title} (${book.type})`);
      doc.text(`   Publisher: ${book.publisher} | Year: ${book.publicationYear}`, { indent: 20 });
    });
  } else {
    doc.text('No books/chapters recorded.');
  }
  doc.moveDown();
}

// Helper function: Add IPR
function addIPR(doc, disclosures, patents) {
  doc.fontSize(14).font('Helvetica-Bold').text('6. Disclosures Filed', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (disclosures.length > 0) {
    disclosures.forEach((d, index) => {
      doc.text(`${index + 1}. ${d.title} (Filed: ${new Date(d.filingDate).toLocaleDateString()})`);
    });
  } else {
    doc.text('No disclosures recorded.');
  }
  doc.moveDown();
  
  doc.fontSize(14).font('Helvetica-Bold').text('7. Patents Granted', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (patents.length > 0) {
    patents.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.title} (${p.patentNumber})`);
    });
  } else {
    doc.text('No patents recorded.');
  }
  doc.moveDown();
}

// Helper function: Add Research Guidance
function addResearchGuidance(doc, ug, masters, phd) {
  doc.fontSize(14).font('Helvetica-Bold').text('8-10. Research Guidance', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  const totalUG = ug.reduce((sum, g) => sum + g.numberOfStudents, 0);
  const totalMasters = masters.reduce((sum, g) => sum + g.numberOfStudents, 0);
  const totalPhD = phd.reduce((sum, g) => sum + g.numberOfScholars, 0);
  
  doc.text(`UG Students: ${totalUG}`);
  doc.text(`Master's Students: ${totalMasters}`);
  doc.text(`PhD Scholars: ${totalPhD}`);
  doc.moveDown();
}

// Helper function: Add Projects
function addProjects(doc, funded, consulting) {
  doc.fontSize(14).font('Helvetica-Bold').text('11-12. Projects', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  
  if (funded.length > 0) {
    doc.text('Funded Projects:');
    funded.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.title} (₹${p.fundingAmount})`);
    });
  }
  doc.moveDown(0.5);
  
  if (consulting.length > 0) {
    doc.text('Consulting Projects:');
    consulting.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.title} (₹${p.amount})`);
    });
  }
  doc.moveDown();
}

// Add remaining sections similarly...
function addProfessionalActivities(doc, reviewers, fdp, talks) {
  doc.fontSize(14).font('Helvetica-Bold').text('13-15. Professional Activities', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Reviewer Roles: ${reviewers.length}`);
  doc.text(`Events Organized: ${fdp.length}`);
  doc.text(`Invited Talks: ${talks.length}`);
  doc.moveDown();
}

function addEvents(doc, outside, inside) {
  doc.fontSize(14).font('Helvetica-Bold').text('16-17. Events Participated', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Outside Institute: ${outside.length}`);
  doc.text(`Inside Institute: ${inside.length}`);
  doc.moveDown();
}

function addIndustryAndServices(doc, industry, institutional, other) {
  doc.fontSize(14).font('Helvetica-Bold').text('18-20. Services', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Industry Relations: ${industry.length}`);
  doc.text(`Institutional Services: ${institutional.length}`);
  doc.text(`Other Services: ${other.length}`);
  doc.moveDown();
}

function addAwardsAndOthers(doc, awards, professionalism, others) {
  doc.fontSize(14).font('Helvetica-Bold').text('21-23. Awards & Others', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Awards: ${awards.length}`);
  if (professionalism) {
    doc.text(`Professionalism Rating: ${professionalism.rating}/5`);
  }
  doc.text(`Other Contributions: ${others.length}`);
  doc.moveDown();
}

module.exports = {
  generateReport
};