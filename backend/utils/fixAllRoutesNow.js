const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../routes');

const routesToFix = [
  'awardRoutes.js',
  'bookRoutes.js',
  'consultingProjectRoutes.js',
  'disclosureRoutes.js',
  'eventInsideRoutes.js',
  'eventOutsideRoutes.js',
  'fciScoreRoutes.js',
  'fdpOrganizedRoutes.js',
  'fundedProjectRoutes.js',
  'industryRelationRoutes.js',
  'institutionalServiceRoutes.js',
  'invitedTalkRoutes.js',
  'mastersGuidanceRoutes.js',
  'nonIndexedPublicationRoutes.js',
  'otherContributionRoutes.js',
  'otherServiceRoutes.js',
  'patentRoutes.js',
  'phdGuidanceRoutes.js',
  'professionalismRoutes.js',
  'reviewerRoleRoutes.js',
  'ugGuidanceRoutes.js'
];

console.log('Fixing all routes to use upload.array("documents", 10)...\n');

routesToFix.forEach(fileName => {
  const filePath = path.join(routesDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace upload.single('file') with upload.array('documents', 10)
    const updated = content.replace(/upload\.single\('file'\)/g, "upload.array('documents', 10)");
    
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✓ Fixed: ${fileName}`);
    } else {
      console.log(`- Skipped: ${fileName} (already correct or no changes needed)`);
    }
  } else {
    console.log(`✗ Not found: ${fileName}`);
  }
});

console.log('\n✅ All routes have been updated!');
console.log('Please restart your backend server.');
