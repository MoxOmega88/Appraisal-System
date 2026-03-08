const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');

const allModels = [
  'FCIScore.js',
  'JournalPaper.js',
  'ConferencePaper.js',
  'NonIndexedPublication.js',
  'Book.js',
  'Disclosure.js',
  'Patent.js',
  'UGGuidance.js',
  'MastersGuidance.js',
  'PhDGuidance.js',
  'FundedProject.js',
  'ConsultingProject.js',
  'ReviewerRole.js',
  'FDPOrganized.js',
  'InvitedTalk.js',
  'EventOutside.js',
  'EventInside.js',
  'IndustryRelation.js',
  'InstitutionalService.js',
  'OtherService.js',
  'Award.js',
  'Professionalism.js',
  'OtherContribution.js'
];

console.log('Fixing double commas in all models...\n');

allModels.forEach(fileName => {
  const filePath = path.join(modelsDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix double commas
    const originalContent = content;
    content = content.replace(/},\s*,\s*documents:/g, '},\n  documents:');
    content = content.replace(/}\s*,\s*,/g, '},');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${fileName}`);
    } else {
      console.log(`- OK: ${fileName}`);
    }
  } else {
    console.log(`✗ Not found: ${fileName}`);
  }
});

console.log('\n✅ All syntax errors fixed!');
console.log('Try starting the backend now.');
