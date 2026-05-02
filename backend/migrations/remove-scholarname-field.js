/**
 * Migration: Remove unused scholarName field from PhDGuidance collection
 * Run this once to clean up existing data
 */

const mongoose = require('mongoose');
require('dotenv').config();

const PhDGuidance = require('../models/PhDGuidance');

async function removeScholarNameField() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\nRemoving scholarName field from PhDGuidance documents...');
    
    const result = await PhDGuidance.updateMany(
      { scholarName: { $exists: true } },
      { $unset: { scholarName: "" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} documents`);
    console.log('✅ Migration completed successfully');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
removeScholarNameField();
