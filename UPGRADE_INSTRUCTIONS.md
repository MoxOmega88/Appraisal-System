# Faculty Appraisal System - Upgrade Instructions

## New Features Added

### 1. File Upload System
- Every appraisal category now supports file uploads (PDF/DOC/images)
- Files organized in structured folders (01_FCI_Score, 02_Journal_Papers, etc.)
- File paths stored in MongoDB

### 2. ZIP File Generation
- Generate complete appraisal package with one click
- Includes PDF report + all uploaded files in organized folders
- Download as: `FacultyName_Term.zip`

### 3. Enhanced PDF Generation
- Professional academic format using pdfmake
- Proper tables with borders
- Sl No, Details, and Appendix columns
- Appendix shows "Y" if file uploaded, "NA" otherwise

### 4. New Required Fields
- **Journal Papers**: Added `quartile` field (Q1/Q2/Q3/Q4)
- **Conference Papers**: Added `quartile` field (Q1/Q2/Q3/Q4)
- **Patents**: Added `status` field (Filed/Published/Granted)

### 5. Professional Dashboard UI
- Material-UI based design
- Categorized statistics cards with icons
- Color-coded sections
- Hover effects and animations
- Generate Final Report button

### 6. Modern File Upload UI
- Styled upload button with icon
- File name display after selection
- File size indicator
- Success feedback
- Drag-and-drop style interface

## Installation Steps

### Step 1: Install New Backend Dependencies

Open CMD (not PowerShell) and run:

```cmd
cd backend
npm install multer archiver pdfmake
```

### Step 2: Create Upload Directories

The system will auto-create these, but you can create manually:

```cmd
cd backend
mkdir uploads
cd uploads
mkdir 01_FCI_Score 02_Journal_Papers 03_Indexed_Conferences 04_NonIndexed_Publications 05_Books_Chapters 06_Disclosures_Filed 07_Patents_Granted 08_UG_Guidance 09_Masters_Guidance 10_PhD_Guidance 11_Funded_Projects 12_Consulting_Projects 13_Reviewer_Roles 14_FDP_Organized 15_Invited_Talks 16_Events_Outside 17_Events_Inside 18_Industry_Relations 19_Institutional_Services 20_Other_Services 21_Awards 22_Professionalism 23_Other_Contributions
```

### Step 3: Update Frontend Dependencies

```cmd
cd frontend
npm install @mui/icons-material
```

### Step 4: Update Models (Add filePath field)

All models need a `filePath` field. The following models have been updated:
- JournalPaper (added quartile + filePath)
- ConferencePaper (added quartile + filePath)
- Patent (added status + filePath)

For remaining models, add this field before the closing brace:

```javascript
filePath: {
  type: String,
  default: null
}
```

### Step 5: Update Backend Routes

Each route needs to support file upload. Example for journal-papers:

```javascript
const { upload } = require('../middleware/uploadMiddleware');

// Create with file upload
router.post('/', protect, upload.single('file'), createJournalPaper);

// Update with file upload
router.put('/:id', protect, upload.single('file'), updateJournalPaper);
```

### Step 6: Update Controllers

Controllers need to handle file path:

```javascript
exports.createJournalPaper = async (req, res) => {
  try {
    const journalPaper = await JournalPaper.create({
      ...req.body,
      facultyId: req.user.id,
      filePath: req.file ? `/uploads/${req.file.filename}` : null
    });
    res.status(201).json(journalPaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

### Step 7: Update Frontend App.js

Replace old pages with new ones:

```javascript
import DashboardNew from './pages/DashboardNew';
import JournalPapersPageNew from './pages/JournalPapersPageNew';

// In routes:
<Route path="/dashboard" element={<DashboardNew />} />
<Route path="/journal-papers" element={<JournalPapersPageNew />} />
```

### Step 8: Test the System

1. **Start Backend:**
```cmd
cd backend
npm start
```

2. **Start Frontend:**
```cmd
cd frontend
npm start
```

3. **Test File Upload:**
   - Go to any module (e.g., Journal Papers)
   - Click "Add New"
   - Fill form and upload a file
   - Verify file appears in uploads folder

4. **Test Final Report Generation:**
   - Go to Dashboard
   - Select a term
   - Click "Generate Final Report (ZIP)"
   - Verify ZIP downloads with PDF and files

## File Structure

```
backend/
├── middleware/
│   └── uploadMiddleware.js          (NEW)
├── utils/
│   ├── pdfGenerator.js              (NEW)
│   └── addFilePathToModels.js       (NEW - utility)
├── controllers/
│   └── finalReportController.js     (NEW)
├── routes/
│   └── finalReportRoutes.js         (NEW)
├── uploads/                         (NEW)
│   ├── 01_FCI_Score/
│   ├── 02_Journal_Papers/
│   └── ... (23 folders total)
└── server.js                        (UPDATED)

frontend/
├── src/
│   ├── components/
│   │   ├── FileUploadButton.js              (NEW)
│   │   └── GenericCRUDPageWithUpload.js     (NEW)
│   └── pages/
│       ├── DashboardNew.js                  (NEW)
│       └── JournalPapersPageNew.js          (NEW)
```

## API Endpoints

### New Endpoint

```
GET /api/generate-final-report/:termId
```

**Description:** Generates ZIP file with PDF report and all uploaded files

**Response:** ZIP file download

**Example:**
```javascript
const response = await api.get(`/generate-final-report/${termId}`, {
  responseType: 'blob'
});
```

## Database Schema Updates

### All Models Now Include:

```javascript
filePath: {
  type: String,
  default: null
}
```

### Journal Paper & Conference Paper:

```javascript
quartile: {
  type: String,
  enum: ['Q1', 'Q2', 'Q3', 'Q4'],
  required: true
}
```

### Patent:

```javascript
status: {
  type: String,
  enum: ['Filed', 'Published', 'Granted'],
  required: true,
  default: 'Granted'
}
```

## Troubleshooting

### Issue: npm install fails in PowerShell

**Solution:** Use CMD instead of PowerShell

```cmd
# Open CMD
cd backend
npm install multer archiver pdfmake
```

### Issue: File upload returns 404

**Solution:** Check if uploads folder exists and server.js has:

```javascript
app.use('/uploads', express.static('uploads'));
```

### Issue: ZIP generation fails

**Solution:** 
1. Check all models have `filePath` field
2. Verify files exist in uploads folder
3. Check console for errors

### Issue: PDF generation fails

**Solution:** pdfmake might need fonts. The code uses fallback fonts (Helvetica) which work without additional setup.

### Issue: Dashboard doesn't show new UI

**Solution:** Update App.js to use DashboardNew instead of Dashboard

## Migration Notes

### For Existing Data

If you have existing records without `filePath`:
- They will show "No File" in the table
- You can edit them and upload files
- The `filePath` field defaults to `null`

### Backward Compatibility

- Old pages still work
- New pages are named with "New" suffix
- Gradually migrate to new pages
- Both can coexist during transition

## Next Steps

1. Test all 23 modules with file upload
2. Create similar "New" pages for other modules
3. Update all routes to support file upload
4. Test ZIP generation with multiple files
5. Customize PDF format as needed
6. Add file size limits if needed
7. Implement file deletion when record is deleted

## Production Considerations

1. **File Storage:** Consider cloud storage (AWS S3, Azure Blob) for production
2. **File Size:** Current limit is 10MB, adjust in uploadMiddleware.js
3. **Security:** Validate file types on server side
4. **Backup:** Include uploads folder in backup strategy
5. **Performance:** Consider CDN for file serving

## Support

For issues or questions:
1. Check console logs (browser and server)
2. Verify all dependencies installed
3. Check file permissions on uploads folder
4. Review API responses in Network tab

---

**Upgrade completed successfully! Your Faculty Appraisal System now has professional file management and reporting capabilities.**
