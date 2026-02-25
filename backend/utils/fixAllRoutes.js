// Script to update all route files to use correct upload middleware
const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../routes');
const files = fs.readdirSync(routesDir);

const routeFiles = files.filter(f => 
  f.endsWith('Routes.js') && 
  f !== 'authRoutes.js' && 
  f !== 'termRoutes.js' && 
  f !== 'reportRoutes.js' &&
  f !== 'finalReportRoutes.js'
);

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace old upload middleware import
  if (content.includes("require('../uploads/proofs/UploadMiddleware')")) {
    content = content.replace(
      "const upload = require('../uploads/proofs/UploadMiddleware');",
      "const { upload } = require('../middleware/uploadMiddleware');"
    );
    
    // Replace upload.single('proof') with upload.single('file')
    content = content.replace(/upload\.single\('proof'\)/g, "upload.single('file')");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${file}`);
  } else if (!content.includes("uploadMiddleware")) {
    // Add upload middleware if not present
    const lines = content.split('\n');
    const protectIndex = lines.findIndex(l => l.includes("require('../middleware/authMiddleware')"));
    
    if (protectIndex !== -1) {
      lines.splice(protectIndex + 1, 0, "const { upload } = require('../middleware/uploadMiddleware');");
      
      // Add upload to POST and PUT routes
      content = lines.join('\n');
      content = content.replace(
        /\.post\(protect, controller\.create\)/g,
        ".post(protect, upload.single('file'), controller.create)"
      );
      content = content.replace(
        /\.put\(protect, controller\.update\)/g,
        ".put(protect, upload.single('file'), controller.update)"
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Added upload middleware to ${file}`);
    }
  } else {
    console.log(`- ${file} already updated`);
  }
});

console.log('\nAll routes updated!');
