# File Storage Solutions for Production Deployment

## Current Issue

Files are stored locally in `backend/uploads/` folder. This means:
- ❌ Files uploaded on one computer are NOT accessible from another
- ❌ When deployed to a server, files are lost if the server restarts
- ❌ Not suitable for production use with multiple users

## Solution Options

### Option 1: Cloud Storage (RECOMMENDED for Production)

Use cloud storage services like AWS S3, Google Cloud Storage, or Azure Blob Storage.

#### AWS S3 Implementation

**1. Install required packages:**
```bash
cd backend
npm install aws-sdk multer-s3
```

**2. Update `.env` with AWS credentials:**
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**3. Create `backend/middleware/s3UploadMiddleware.js`:**
```javascript
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const categoryFolders = {
  'journal-papers': '02_Journal_Papers',
  'conference-papers': '03_Indexed_Conferences',
  // ... add all other categories
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read', // Makes files publicly accessible
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const category = req.baseUrl.split('/').pop();
      const folderName = categoryFolders[category] || 'misc';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = uniqueSuffix + '-' + file.originalname;
      cb(null, `${folderName}/${fileName}`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'));
    }
  }
});

module.exports = { upload };
```

**4. Update `genericController.js` to save S3 URLs:**
```javascript
if (req.files && req.files.length > 0) {
  recordData.documents = req.files.map(file => ({
    fileName: file.key.split('/').pop(),
    filePath: file.location, // S3 URL
    originalName: file.originalname
  }));
}
```

**Benefits:**
- ✅ Files accessible from anywhere
- ✅ Highly reliable and scalable
- ✅ Automatic backups
- ✅ CDN integration for fast delivery
- ✅ No server storage limits

**Cost:** ~$0.023 per GB/month (very cheap for small projects)

---

### Option 2: MongoDB GridFS (Good for Small Files)

Store files directly in MongoDB using GridFS.

**1. Install package:**
```bash
cd backend
npm install multer-gridfs-storage
```

**2. Create `backend/middleware/gridfsUploadMiddleware.js`:**
```javascript
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          metadata: {
            originalName: file.originalname,
            category: req.baseUrl.split('/').pop()
          }
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 16 * 1024 * 1024 } // 16MB limit for GridFS
});

module.exports = { upload };
```

**3. Add file retrieval route in `server.js`:**
```javascript
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

app.get('/api/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});
```

**Benefits:**
- ✅ Files stored in MongoDB (same database)
- ✅ Accessible from anywhere
- ✅ No additional service needed
- ✅ Automatic replication with MongoDB

**Limitations:**
- ⚠️ 16MB file size limit
- ⚠️ Slower than dedicated file storage
- ⚠️ Increases database size

---

### Option 3: Shared Network Storage (For On-Premise Deployment)

Use a shared network drive that all servers can access.

**1. Mount network drive on all servers:**
```bash
# Linux
sudo mount -t nfs server:/share /mnt/uploads

# Windows
net use Z: \\server\share
```

**2. Update `uploadMiddleware.js`:**
```javascript
const uploadPath = process.env.SHARED_STORAGE_PATH || path.join(__dirname, '../uploads');
```

**3. Update `.env`:**
```env
SHARED_STORAGE_PATH=/mnt/uploads
```

**Benefits:**
- ✅ Works for on-premise deployments
- ✅ Full control over storage
- ✅ No cloud costs

**Limitations:**
- ⚠️ Requires network infrastructure
- ⚠️ Single point of failure
- ⚠️ Manual backup needed

---

## Quick Fix for Testing (NOT for Production)

For testing across multiple computers on the same network:

**1. Make sure both computers can access the backend server**

**2. Update frontend `.env` or `package.json` proxy:**
```json
"proxy": "http://192.168.1.100:5000"
```
Replace with your backend server's IP address.

**3. Files will be accessible as long as:**
- Backend server is running
- Both computers are on same network
- Files are in `backend/uploads/` on the server

---

## Recommendation for Your Project

For faculty appraisal system deployment:

**Development/Testing:** Current local storage is fine

**Production Deployment:** Use AWS S3 (Option 1)
- Most reliable
- Scalable
- Professional
- Easy to implement
- Very affordable

---

## Implementation Steps for AWS S3

1. Create AWS account (free tier available)
2. Create S3 bucket
3. Get access keys
4. Install packages: `npm install aws-sdk multer-s3`
5. Update middleware (code provided above)
6. Update controller to save S3 URLs
7. Test upload
8. Deploy

---

## Current System Status

✅ Files are saved with relative paths in MongoDB
✅ File paths work correctly for local access
✅ ZIP and PDF generation work with current setup
⚠️ Files only accessible on the computer where backend runs

**To make files universal:** Implement AWS S3 (recommended) or GridFS before production deployment.

---

## Cost Estimate (AWS S3)

For a faculty appraisal system with 100 faculty members:
- Storage: ~10GB = $0.23/month
- Requests: ~10,000/month = $0.05/month
- **Total: ~$0.30/month** (negligible cost)

Free tier: 5GB storage + 20,000 requests/month for first 12 months!
