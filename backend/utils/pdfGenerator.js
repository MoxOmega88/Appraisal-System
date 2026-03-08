const PDFDocument = require('pdfkit');

/**
 * Generate Professional Faculty Appraisal PDF Report using PDFKit
 */
const generateAppraisalPDF = async (facultyData, termData, appraisalData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      // Collect PDF data
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).fillColor('#1a237e').text('INSTITUTE NAME', { align: 'center' });
      doc.fontSize(12).fillColor('#666666').text('Faculty Appraisal Management System', { align: 'center' });
      doc.moveDown(2);

      // Faculty Information
      doc.fontSize(14).fillColor('#1a237e').text('Faculty Information');
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000000');
      doc.text(`Name: ${facultyData.name || 'N/A'}`);
      doc.text(`Employee ID: ${facultyData.employeeId || 'N/A'}`);
      doc.text(`Department: ${facultyData.department || 'N/A'}`);
      doc.text(`Designation: ${facultyData.designation || 'N/A'}`);
      doc.text(`Email: ${facultyData.email || 'N/A'}`);
      doc.moveDown(1.5);

      // Term Information
      doc.fontSize(14).fillColor('#1a237e').text('Appraisal Term');
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000000');
      doc.text(`Term Name: ${termData.termName || 'N/A'}`);
      doc.text(`Academic Year: ${termData.academicYear || 'N/A'}`);
      if (termData.startDate && termData.endDate) {
        doc.text(`Duration: ${new Date(termData.startDate).toLocaleDateString()} to ${new Date(termData.endDate).toLocaleDateString()}`);
      }
      doc.moveDown(2);

      // Add new page for appraisal summary
      doc.addPage();
      doc.fontSize(14).fillColor('#1a237e').text('Appraisal Summary', { underline: true });
      doc.moveDown(1);

      // Categories with correct field mappings
      const categories = [
        { key: 'fciScores', title: '1. FCI Score', fields: ['courseCode', 'courseName', 'score'] },
        { key: 'journalPapers', title: '2. Refereed Journal Papers', fields: ['title', 'journalName', 'quartile', 'indexedIn', 'year'] },
        { key: 'conferencePapers', title: '3. Indexed Conference Papers', fields: ['title', 'conferenceName', 'quartile', 'year'] },
        { key: 'nonIndexedPublications', title: '4. Non-Indexed Publications', fields: ['title', 'venueName', 'year'] },
        { key: 'books', title: '5. Books / Book Chapters', fields: ['title', 'publisher', 'isbn', 'year'] },
        { key: 'disclosures', title: '6. Disclosures Filed', fields: ['title', 'filingDate', 'applicationNumber'] },
        { key: 'patents', title: '7. Patents', fields: ['title', 'patentNumber', 'status', 'grantDate'] },
        { key: 'ugGuidance', title: '8. UG Research Guidance', fields: ['numberOfStudents', 'projectTitle', 'remarks'] },
        { key: 'mastersGuidance', title: '9. Master\'s Research Guidance', fields: ['numberOfStudents', 'thesisTitle', 'remarks'] },
        { key: 'phdGuidance', title: '10. PhD Research Guidance', fields: ['numberOfScholars', 'scholarName', 'researchArea', 'status'] },
        { key: 'fundedProjects', title: '11. Funded Projects', fields: ['projectTitle', 'fundingAgency', 'amount', 'duration'] },
        { key: 'consultingProjects', title: '12. Consulting Projects', fields: ['projectTitle', 'organization', 'amount'] },
        { key: 'reviewerRoles', title: '13. Reviewer Roles', fields: ['roleType', 'venueName', 'year', 'isQ1Q2Reviewer'] },
        { key: 'fdpOrganized', title: '14. FDP/Events Organized', fields: ['eventTitle', 'durationCategory', 'startDate'] },
        { key: 'invitedTalks', title: '15. Invited Talks', fields: ['title', 'organization', 'date'] },
        { key: 'eventsOutside', title: '16. Events Outside Institute', fields: ['eventName', 'organizer', 'date'] },
        { key: 'eventsInside', title: '17. Events Inside Institute', fields: ['eventName', 'role', 'date'] },
        { key: 'industryRelations', title: '18. Industry Relations', fields: ['type', 'companyName', 'description', 'date'] },
        { key: 'institutionalServices', title: '19. Institutional Services', fields: ['role', 'serviceName', 'description'] },
        { key: 'otherServices', title: '20. Other Services', fields: ['description', 'date'] },
        { key: 'awards', title: '21. Awards & Honours', fields: ['title', 'issuingBody', 'date'] },
        { key: 'professionalism', title: '22. Professionalism', fields: ['rating', 'remarks'] },
        { key: 'otherContributions', title: '23. Other Contributions', fields: ['description'] }
      ];

      categories.forEach((category, catIndex) => {
        const data = appraisalData[category.key] || [];
        
        if (data.length > 0) {
          // Check if we need a new page
          if (doc.y > 650) {
            doc.addPage();
          }

          // Category title
          doc.fontSize(12).fillColor('#1a237e').text(category.title, { underline: true });
          doc.moveDown(0.5);

          // Table header
          const startY = doc.y;
          const colWidths = { slNo: 40, details: 400, appendix: 60 };
          
          doc.fontSize(10).fillColor('#ffffff');
          doc.rect(50, startY, colWidths.slNo, 20).fill('#1a237e');
          doc.rect(90, startY, colWidths.details, 20).fill('#1a237e');
          doc.rect(490, startY, colWidths.appendix, 20).fill('#1a237e');
          
          doc.text('Sl No', 55, startY + 5, { width: colWidths.slNo - 10, align: 'center' });
          doc.text('Details', 95, startY + 5, { width: colWidths.details - 10 });
          doc.text('Appendix', 495, startY + 5, { width: colWidths.appendix - 10, align: 'center' });
          
          doc.moveDown(1.5);

          // Table rows
          data.forEach((item, index) => {
            if (doc.y > 700) {
              doc.addPage();
            }

            const rowY = doc.y;
            doc.fontSize(9).fillColor('#000000');

            // Sl No
            doc.text((index + 1).toString(), 55, rowY, { width: colWidths.slNo - 10, align: 'center' });

            // Details - format field names properly
            const details = category.fields.map(field => {
              if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
                // Convert camelCase to readable format
                let fieldLabel = field
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();
                
                // Handle special cases
                if (field === 'isQ1Q2Reviewer') {
                  fieldLabel = 'Q1/Q2 Reviewer';
                  return `${fieldLabel}: ${item[field] ? 'Yes' : 'No'}`;
                }
                
                // Format dates
                if (field.toLowerCase().includes('date')) {
                  return `${fieldLabel}: ${new Date(item[field]).toLocaleDateString()}`;
                }
                
                // Format numbers
                if (field === 'amount') {
                  return `${fieldLabel}: ₹${item[field].toLocaleString()}`;
                }
                
                return `${fieldLabel}: ${item[field]}`;
              }
              return '';
            }).filter(Boolean).join(', ');

            doc.text(details || 'Entry ' + (index + 1), 95, rowY, { width: colWidths.details - 10 });

            // Appendix
            const hasAppendix = item.filePath ? 'Y' : 'NA';
            doc.text(hasAppendix, 495, rowY, { width: colWidths.appendix - 10, align: 'center' });

            doc.moveDown(1);
          });

          doc.moveDown(1);
        }
      });

      // Finalize PDF (no footer loop to avoid switchToPage error)
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateAppraisalPDF };
