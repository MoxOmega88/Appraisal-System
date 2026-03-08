const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');

const modelsToFix = [
  'FCIScore.js',
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

const documentsField = `  documents: [{
    fileName: String,
    filePath: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]`;

console.log('Adding documents field to all models...\n');

modelsToFix.forEach(fileName => {
  const filePath = path.join(modelsDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if documents field already exists
    if (content.includes('documents:')) {
      console.log(`- Skipped: ${fileName} (already has documents field)`);
      return;
    }
    
    // Find the closing of the schema definition (before }, { timestamps: true })
    const pattern = /(\s*)(}\s*,\s*{\s*timestamps:\s*true)/;
    
    if (pattern.test(content)) {
      content = content.replace(pattern, `,\n${documentsField}\n$1$2`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${fileName}`);
    } else {
      console.log(`✗ Pattern not found in: ${fileName}`);
    }
  } else {
    console.log(`✗ Not found: ${fileName}`);
  }
});

console.log('\n✅ All models have been updated!');
console.log('Please restart your backend server.');
