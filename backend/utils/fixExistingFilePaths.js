/**
 * Utility script to fix existing file paths in database
 * Converts absolute Windows paths to relative paths
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models
const JournalPaper = require('../models/JournalPaper');
const ConferencePaper = require('../models/ConferencePaper');
const NonIndexedPublication = require('../models/NonIndexedPublication');
const Book = require('../models/Book');
const Disclosure = require('../models/Disclosure');
const Patent = require('../models/Patent');
const UGGuidance = require('../models/UGGuidance');
const MastersGuidance = require('../models/MastersGuidance');
const PhDGuidance = require('../models/PhDGuidance');
const FundedProject = require('../models/FundedProject');
const ConsultingProject = require('../models/ConsultingProject');
const ReviewerRole = require('../models/ReviewerRole');
const FDPOrganized = require('../models/FDPOrganized');
const InvitedTalk = require('../models/InvitedTalk');
const EventOutside = require('../models/EventOutside');
const EventInside = require('../models/EventInside');
const IndustryRelation = require('../models/IndustryRelation');
const InstitutionalService = require('../models/InstitutionalService');
const OtherService = require('../models/OtherService');
const Award = require('../models/Award');
const Professionalism = require('../models/Professionalism');
const OtherContribution = require('../models/OtherContribution');

const models = [
  { name: 'JournalPaper', model: JournalPaper },
  { name: 'ConferencePaper', model: ConferencePaper },
  { name: 'NonIndexedPublication', model: NonIndexedPublication },
  { name: 'Book', model: Book },
  { name: 'Disclosure', model: Disclosure },
  { name: 'Patent', model: Patent },
  { name: 'UGGuidance', model: UGGuidance },
  { name: 'MastersGuidance', model: MastersGuidance },
  { name: 'PhDGuidance', model: PhDGuidance },
  { name: 'FundedProject', model: FundedProject },
  { name: 'ConsultingProject', model: ConsultingProject },
  { name: 'ReviewerRole', model: ReviewerRole },
  { name: 'FDPOrganized', model: FDPOrganized },
  { name: 'InvitedTalk', model: InvitedTalk },
  { name: 'EventOutside', model: EventOutside },
  { name: 'EventInside', model: EventInside },
  { name: 'IndustryRelation', model: IndustryRelation },
  { name: 'InstitutionalService', model: InstitutionalService },
  { name: 'OtherService', model: OtherService },
  { name: 'Award', model: Award },
  { name: 'Professionalism', model: Professionalism },
  { name: 'OtherContribution', model: OtherContribution }
];

async function fixFilePaths() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    let totalFixed = 0;

    for (const { name, model } of models) {
      console.log(`\n🔍 Checking ${name}...`);
      
      // Find all records with documents
      const records = await model.find({ documents: { $exists: true, $ne: [] } });
      
      if (records.length === 0) {
        console.log(`   No records with documents found`);
        continue;
      }

      let fixedCount = 0;

      for (const record of records) {
        let needsUpdate = false;
        const updatedDocuments = record.documents.map(doc => {
          // Check if filePath contains absolute path (has C:/ or full path)
          if (doc.filePath && (doc.filePath.includes('C:/') || doc.filePath.includes('C:\\'))) {
            needsUpdate = true;
            // Extract the part after 'uploads'
            const relativePath = doc.filePath.split('uploads')[1].replace(/\\/g, '/');
            return {
              ...doc.toObject(),
              filePath: `/uploads${relativePath}`
            };
          }
          return doc;
        });

        if (needsUpdate) {
          record.documents = updatedDocuments;
          await record.save();
          fixedCount++;
          console.log(`   ✓ Fixed record ${record._id}`);
        }
      }

      if (fixedCount > 0) {
        console.log(`   ✅ Fixed ${fixedCount} ${name} records`);
        totalFixed += fixedCount;
      } else {
        console.log(`   ✓ All ${name} records already have correct paths`);
      }
    }

    console.log(`\n🎉 Done! Fixed ${totalFixed} total records`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the script
fixFilePaths();
