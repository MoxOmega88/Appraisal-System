// Utility script to add filePath field to all models
// This adds the filePath field before the closing brace of each schema

const fs = require('fs');
const path = require('path');

const modelsToUpdate = [
  'FCIScore', 'NonIndexedPublication', 'Book', 'Disclosure',
  'UGGuidance', 'MastersGuidance', 'PhDGuidance',
  'FundedProject', 'ConsultingProject', 'ReviewerRole',
  'FDPOrganized', 'InvitedTalk', 'EventOutside', 'EventInside',
  'IndustryRelation', 'InstitutionalService', 'OtherService',
  'Award', 'Professionalism', 'OtherContribution'
];

const filePathField = `  filePath: {
    type: String,
    default: null
  }`;

modelsToUpdate.forEach(modelName => {
  const filePath = path.join(__dirname, '../models', `${modelName}.js`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if filePath already exists
    if (!content.includes('filePath:')) {
      // Find the last field before closing brace
      // Add filePath field before the closing brace of schema definition
      const regex = /(proofUrl:\s*{[^}]+}\s*)(}\s*,\s*{\s*timestamps:\s*true)/;
      
      if (regex.test(content)) {
        content = content.replace(regex, `$1,\n${filePathField}\n$2`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated ${modelName}.js`);
      } else {
        console.log(`✗ Pattern not found in ${modelName}.js`);
      }
    } else {
      console.log(`- ${modelName}.js already has filePath`);
    }
  } else {
    console.log(`✗ File not found: ${modelName}.js`);
  }
});

console.log('\nDone!');
