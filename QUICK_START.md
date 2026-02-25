# Quick Start Guide - Enhanced Faculty Appraisal System

## What's New? 🎉

✅ File upload for all 23 modules  
✅ Professional PDF reports with pdfmake  
✅ ZIP file generation with organized folders  
✅ New fields: Quartile (Q1-Q4) for papers, Status for patents  
✅ Modern Material-UI dashboard  
✅ Styled file upload buttons  

## Installation (5 Minutes)

### 1. Install Backend Dependencies

**Open CMD (not PowerShell):**

```cmd
cd backend
npm install multer archiver pdfmake
```

### 2. Install Frontend Dependencies

```cmd
cd frontend
npm install @mui/icons-material
```

### 3. That's It!

The system will auto-create upload folders when needed.

## Running the System

### Terminal 1 - Backend:
```cmd
cd backend
npm start
```

### Terminal 2 - Frontend:
```cmd
cd frontend
npm start
```

## Testing New Features

### 1. Test File Upload

1. Go to http://localhost:3000
2. Login
3. Navigate to "Journal Papers"
4. Click "Add New"
5. Fill the form
6. **Select Quartile** (Q1/Q2/Q3/Q4) - NEW FIELD!
7. Click "Upload Proof/Certificate"
8. Select a PDF/image file
9. Click "Create"
10. ✅ File uploaded and saved!

### 2. Test Dashboard

1. Go to Dashboard
2. See beautiful statistics cards with icons
3. All categories organized by type
4. Professional colors and layout

### 3. Test Final Report Generation

1. Go to Dashboard
2. Select a term
3. Click "Generate Final Report (ZIP)"
4. Wait for download
5. Open ZIP file:
   - ✅ Appraisal_Report.pdf
   - ✅ Folders: 01_FCI_Score, 02_Journal_Papers, etc.
   - ✅ All your uploaded files organized!

## Manual Commands (If Needed)

### Create Upload Folders Manually:

```cmd
cd backend
mkdir uploads
cd uploads
mkdir 01_FCI_Score 02_Journal_Papers 03_Indexed_Conferences 04_NonIndexed_Publications 05_Books_Chapters 06_Disclosures_Filed 07_Patents_Granted 08_UG_Guidance 09_Masters_Guidance 10_PhD_Guidance 11_Funded_Projects 12_Consulting_Projects 13_Reviewer_Roles 14_FDP_Organized 15_Invited_Talks 16_Events_Outside 17_Events_Inside 18_Industry_Relations 19_Institutional_Services 20_Other_Services 21_Awards 22_Professionalism 23_Other_Contributions
```

## Using New Pages

The new enhanced pages are created with "New" suffix:

- `DashboardNew.js` - Enhanced dashboard
- `JournalPapersPageNew.js` - With file upload
- `GenericCRUDPageWithUpload.js` - Reusable component

### To Use New Dashboard:

Update `frontend/src/App.js`:

```javascript
import DashboardNew from './pages/DashboardNew';

// In routes:
<Route path="/dashboard" element={<DashboardNew />} />
```

### To Use New Journal Papers Page:

```javascript
import JournalPapersPageNew from './pages/JournalPapersPageNew';

<Route path="/journal-papers" element={<JournalPapersPageNew />} />
```

## New API Endpoint

```
GET /api/generate-final-report/:termId
```

Returns ZIP file with:
- PDF report
- All uploaded files in organized folders

## Troubleshooting

### PowerShell Script Execution Error?

**Use CMD instead:**
1. Press Win + R
2. Type `cmd`
3. Navigate to project folder
4. Run npm commands

### File Upload Not Working?

Check `backend/server.js` has:
```javascript
app.use('/uploads', express.static('uploads'));
```

### ZIP Download Fails?

1. Check backend console for errors
2. Verify files exist in uploads folder
3. Check MongoDB has filePath values

## File Upload Limits

- **Max Size:** 10MB per file
- **Allowed Types:** PDF, DOC, DOCX, JPG, JPEG, PNG
- **Storage:** Local uploads folder (consider cloud for production)

## Next Steps

1. ✅ Test file upload on all modules
2. ✅ Generate sample reports
3. ✅ Share with your friend via GitHub
4. ✅ Deploy to production (optional)

## Production Deployment

For production, consider:
- Use cloud storage (AWS S3, Azure Blob)
- Increase file size limits if needed
- Add virus scanning for uploads
- Implement file cleanup for deleted records

## Need Help?

1. Check `UPGRADE_INSTRUCTIONS.md` for detailed info
2. Review console logs (browser F12 + backend terminal)
3. Verify all dependencies installed
4. Check MongoDB connection

---

**You're all set! Enjoy your enhanced Faculty Appraisal System! 🎓**
