/**
 * Script to create an admin user account
 * Run this once to create the admin user
 * 
 * Usage: node backend/scripts/createAdminUser.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: '../.env' });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Employee ID:', existingAdmin.employeeId);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@gmail.com',
      password: 'admin123', // This will be hashed automatically by the User model
      employeeId: 'ADMIN001',
      department: 'Administration',
      designation: 'System Administrator',
      joiningDate: new Date()
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Admin Login Credentials:');
    console.log('========================');
    console.log('Email:    admin@gmail.com');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
