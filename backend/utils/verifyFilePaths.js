/**
 * Utility to verify file paths in database
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const JournalPaper = require('../models/JournalPaper');

async function verifyPaths() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    const records = await JournalPaper.find({ documents: { $exists: true, $ne: [] } });
    
    console.log(`Found ${records.length} Journal Paper records with documents\n`);
    
    for (const record of records) {
      console.log(`Record ID: ${record._id}`);
      for (const doc of record.documents) {
        console.log(`  File Path in DB: ${doc.filePath}`);
        
        // Construct the actual file path
        const relativePath = doc.filePath.startsWith('/') ? doc.filePath.substring(1) : doc.filePath;
        const absolutePath = path.join(__dirname, '..', relativePath.replace(/\//g, path.sep));
        
        console.log(`  Absolute Path: ${absolutePath}`);
        console.log(`  File Exists: ${fs.existsSync(absolutePath) ? '✅ YES' : '❌ NO'}`);
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

verifyPaths();
