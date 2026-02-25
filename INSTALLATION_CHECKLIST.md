# Installation Checklist ✅

## Before Running

### Backend Dependencies
```cmd
cd backend
npm install multer archiver pdfmake
```

- [ ] multer installed (file upload)
- [ ] archiver installed (ZIP generation)
- [ ] pdfmake installed (PDF generation)

### Frontend Dependencies
```cmd
cd frontend
npm install @mui/icons-material
```

- [ ] @mui/icons-material installed (icons for dashboard)

## Running the System

### Terminal 1 - Backend
```cmd
cd backend
npm start
```

- [ ] Backend starts without errors
- [ ] See: "✅ MongoDB Connected Successfully"
- [ ] See: "🚀 Server running on port 5000"

### Terminal 2 - Frontend
```cmd
cd frontend
npm start
```

- [ ] Frontend starts without errors
- [ ] Browser opens at http://localhost:3000
- [ ] No console errors in browser (F12)

## Testing New Features

### 1. Dashboard
- [ ] Login successful
- [ ] New dashboard loads with statistics cards
- [ ] Cards show icons and colors
- [ ] "Generate Final Report" button visible

### 2. Journal Papers (with new fields)
- [ ] Navigate to Journal Papers
- [ ] Click "Add New"
- [ ] See "Quartile" dropdown (Q1/Q2/Q3/Q4)
- [ ] See "Upload Proof/Certificate" button
- [ ] Can select and upload a file
- [ ] File name shows after selection
- [ ] Record saves successfully

### 3. File Upload
- [ ] Upload a PDF file
- [ ] File appears in table with "View" chip
- [ ] Click "View" opens the file
- [ ] File stored in backend/uploads folder

### 4. ZIP Generation
- [ ] Click "Generate Final Report (ZIP)"
- [ ] ZIP file downloads
- [ ] ZIP contains Appraisal_Report.pdf
- [ ] ZIP contains organized folders
- [ ] Uploaded files are in correct folders

## Files Created

### Backend
- [ ] backend/middleware/uploadMiddleware.js
- [ ] backend/controllers/finalReportController.js
- [ ] backend/routes/finalReportRoutes.js
- [ ] backend/utils/pdfGenerator.js
- [ ] backend/utils/addFilePathToModels.js

### Frontend
- [ ] frontend/src/components/FileUploadButton.js
- [ ] frontend/src/components/GenericCRUDPageWithUpload.js
- [ ] frontend/src/pages/DashboardNew.js
- [ ] frontend/src/pages/JournalPapersPageNew.js

### Documentation
- [ ] UPGRADE_INSTRUCTIONS.md
- [ ] QUICK_START.md
- [ ] RUN_ME.md
- [ ] INSTALLATION_CHECKLIST.md (this file)

### Models Updated
- [ ] backend/models/JournalPaper.js (added quartile + filePath)
- [ ] backend/models/ConferencePaper.js (added quartile + filePath)
- [ ] backend/models/Patent.js (added status + filePath)

### Configuration Updated
- [ ] backend/server.js (added finalReportRoutes)
- [ ] frontend/src/App.js (added new pages)

## Common Issues & Solutions

### Issue: npm install fails in PowerShell
**Solution:** Use CMD instead
```cmd
# Press Win + R, type: cmd
cd path\to\project\backend
npm install multer archiver pdfmake
```

### Issue: Module not found errors
**Solution:** Install dependencies in correct folders
```cmd
# Backend dependencies
cd backend
npm install

# Frontend dependencies  
cd frontend
npm install
```

### Issue: Can't see new dashboard
**Solution:** Clear browser cache or hard refresh (Ctrl + Shift + R)

### Issue: File upload returns 404
**Solution:** Check backend/server.js has:
```javascript
app.use('/uploads', express.static('uploads'));
```

### Issue: ZIP generation fails
**Solution:** 
1. Check backend console for errors
2. Verify models have filePath field
3. Check files exist in uploads folder

## Ready to Push to GitHub?

Before pushing:
- [ ] All features tested
- [ ] No errors in console
- [ ] .env file NOT committed (check .gitignore)
- [ ] README.md updated (optional)

Push commands:
```cmd
git add .
git commit -m "Enhanced system with file upload, ZIP generation, and professional UI"
git push origin main
```

## For Your Friend

Share:
- [ ] GitHub repository link
- [ ] MongoDB connection string (privately)
- [ ] RUN_ME.md instructions

They need to:
1. Clone repository
2. Install dependencies (npm install in both folders)
3. Create .env file with MongoDB URI
4. Run both servers

---

## Status: 
- [ ] All dependencies installed
- [ ] Backend running
- [ ] Frontend running
- [ ] Features tested
- [ ] Ready to use!

**Once all checkboxes are checked, you're good to go! 🎉**
