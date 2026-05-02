/**
 * Migration Script: Fix FDP Duration Type
 * 
 * This script converts durationCategory from String to Number
 * for all existing FDPOrganized records.
 * 
 * Run this ONCE after deploying the model change.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const FDPOrganized = mongoose.model('FDPOrganized', new mongoose.Schema({}, { strict: false }));

async function migrateFDPDuration() {
  try {
    console.log('🔄 Starting FDP Duration migration...');
    
    // Find all FDP records where durationCategory is a string
    const records = await FDPOrganized.find({ 
      durationCategory: { $type: 'string' } 
    });
    
    console.log(`📊 Found ${records.length} records to migrate`);
    
    if (records.length === 0) {
      console.log('✅ No records need migration');
      process.exit(0);
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const record of records) {
      try {
        // Convert string to number
        const durationNumber = parseInt(record.durationCategory, 10);
        
        if (isNaN(durationNumber)) {
          console.warn(`⚠️  Skipping record ${record._id}: Invalid duration value "${record.durationCategory}"`);
          errorCount++;
          continue;
        }
        
        // Update the record
        await FDPOrganized.updateOne(
          { _id: record._id },
          { $set: { durationCategory: durationNumber } }
        );
        
        successCount++;
        console.log(`✅ Migrated record ${record._id}: "${record.durationCategory}" → ${durationNumber}`);
      } catch (err) {
        console.error(`❌ Error migrating record ${record._id}:`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Total records: ${records.length}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the logs.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateFDPDuration();
