# 🚀 HOW TO RUN - Faculty Appraisal System

## FIRST TIME SETUP (Do Once)

### Step 1: Install Backend Dependencies

Open **CMD** (Command Prompt):

```cmd
cd backend
npm install multer archiver pdfmake
```

Wait for installation to complete.

### Step 2: Install Frontend Dependencies

```cmd
cd frontend
npm install @mui/icons-material
```

Wait for installation to complete.

## RUNNING THE APPLICATION (Every Time)

### Open 2 Command Prompt Windows

#### Window 1 - Backend Server:

```cmd
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

#### Window 2 - Frontend Server:

```cmd
cd frontend
npm start
```

Browser will automatically open at: http://localhost:3000

## WHAT'S NEW? ✨

### 1. Enhanced Dashboard
- Beautiful statistics cards with icons
- Color-coded categories
- Professional Material-UI design
- Generate Final Report button

### 2. File Upload System
- Upload PDF/DOC/images for every record
- Files organized in 23 folders
- View uploaded files in table

### 3. New Required Fields
- **Journal Papers**: Quartile (Q1/Q2/Q3/Q4)
- **Conference Papers**: Quartile (Q1/Q2/Q3/Q4)
- **Patents**: Status (Filed/Published/Granted)

### 4. ZIP Report Generation
- Click "Generate Final Report (ZIP)"
- Downloads: FacultyName_Term.zip
- Contains:
  - Appraisal_Report.pdf (professional format)
  - All uploaded files in organized folders

## TESTING THE NEW FEATURES

### Test 1: New Dashboard
1. Login at http://localhost:3000
2. You'll see the new dashboard automatically
3. Select a term
4. View statistics cards

### Test 2: File Upload (Journal Papers)
1. Click "Journal Papers" in sidebar
2. Click "Add New"
3. Fill in:
   - Title
   - Journal Name
   - Indexed In
   - **Quartile** (NEW - select Q1/Q2/Q3/Q4)
   - Author Position
   - Publication Date
4. Click "Upload Proof/Certificate"
5. Select a PDF or image file
6. Click "Create"
7. ✅ Record created with file!

### Test 3: Generate Final Report
1. Go to Dashboard
2. Select a term with data
3. Click "Generate Final Report (ZIP)"
4. Wait 5-10 seconds
5. ZIP file downloads automatically
6. Open ZIP:
   - See Appraisal_Report.pdf
   - See folders: 01_FCI_Score, 02_Journal_Papers, etc.
   - See your uploaded files inside folders

## TROUBLESHOOTING

### Problem: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org

### Problem: PowerShell script execution error
**Solution:** Use CMD instead of PowerShell

### Problem: Port 5000 already in use
**Solution:** 
```cmd
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Problem: MongoDB connection error
**Solution:** Check your `.env` file has correct MONGODB_URI

### Problem: File upload not working
**Solution:** 
1. Check backend console for errors
2. Verify `uploads` folder exists in backend
3. Check server.js has: `app.use('/uploads', express.static('uploads'));`

### Problem: Can't see new dashboard
**Solution:** Clear browser cache (Ctrl + Shift + Delete)

## FILE STRUCTURE

```
backend/
├── uploads/              (Auto-created for file storage)
│   ├── 01_FCI_Score/
│   ├── 02_Journal_Papers/
│   └── ... (23 folders)
├── middleware/
│   └── uploadMiddleware.js    (NEW)
├── controllers/
│   └── finalReportController.js (NEW)
├── routes/
│   └── finalReportRoutes.js   (NEW)
└── utils/
    └── pdfGenerator.js        (NEW)

frontend/
├── src/
│   ├── components/
│   │   ├── FileUploadButton.js           (NEW)
│   │   └── GenericCRUDPageWithUpload.js  (NEW)
│   └── pages/
│       ├── DashboardNew.js               (NEW)
│       └── JournalPapersPageNew.js       (NEW)
```

## ACCESSING OLD PAGES

If you want to see old pages:
- Old Dashboard: http://localhost:3000/dashboard-old
- Old Journal Papers: http://localhost:3000/journal-papers-old

## NEXT STEPS

1. ✅ Test all features
2. ✅ Add data to different modules
3. ✅ Upload files for records
4. ✅ Generate final report
5. ✅ Share with your friend via GitHub

## PUSHING TO GITHUB

```cmd
git add .
git commit -m "Added file upload, ZIP generation, and enhanced UI"
git push origin main
```

## FOR YOUR FRIEND

Send them:
1. GitHub repository link
2. This RUN_ME.md file
3. MongoDB connection string (via private message)

They need to:
1. Clone repo
2. Run `npm install` in backend and frontend
3. Create `.env` file with MongoDB URI
4. Run both servers

---

**Everything is ready! Start both servers and enjoy your enhanced system! 🎓**
