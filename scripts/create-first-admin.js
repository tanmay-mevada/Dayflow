/**
 * Script to create the first admin user
 * Run this with: node scripts/create-first-admin.js
 * 
 * Make sure to set your MONGO_URI in .env.local first
 * Or pass it as: MONGO_URI=your_uri node scripts/create-first-admin.js
 */

// Try to load dotenv if available, otherwise use process.env directly
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, will use process.env directly
  console.log('Note: dotenv not found, using process.env directly');
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (simplified for script)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  loginId: String,
  companyName: String,
  firstName: String,
  lastName: String,
  employeeId: String,
  phoneNumber: String,
  designation: String,
  department: String,
  dateOfJoining: Date,
  role: String,
  isVerified: Boolean,
  isPasswordChanged: Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Generate Login ID function
async function generateLoginId(companyName, firstName, lastName, dateOfJoining) {
  const companyPrefix = companyName.substring(0, 2).toUpperCase();
  const namePrefix = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
  const year = dateOfJoining.getFullYear().toString();
  
  const existingUsers = await User.find({
    companyName: companyName,
    dateOfJoining: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    },
  }).sort({ loginId: -1 });

  let serialNumber = 1;
  if (existingUsers.length > 0) {
    const serialNumbers = existingUsers
      .map((user) => {
        if (user.loginId) {
          const match = user.loginId.match(/\d{4}$/);
          return match ? parseInt(match[0]) : 0;
        }
        return 0;
      })
      .filter((num) => num > 0);

    if (serialNumbers.length > 0) {
      serialNumber = Math.max(...serialNumbers) + 1;
    }
  }

  const serialStr = serialNumber.toString().padStart(4, '0');
  return `${companyPrefix}${namePrefix}${year}${serialStr}`;
}

async function createFirstAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in .env.local');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ 
      role: { $in: ['admin', 'hr_officer'] } 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Login ID: ${existingAdmin.loginId || 'N/A'}`);
      process.exit(0);
    }

    // Get admin details from command line or use defaults
    const args = process.argv.slice(2);
    const companyName = args[0] || 'Your Company';
    const firstName = args[1] || 'Admin';
    const lastName = args[2] || 'User';
    const email = args[3] || 'admin@example.com';
    const password = args[4] || 'Admin@123';
    const dateOfJoining = args[5] || new Date().toISOString().split('T')[0];

    console.log('\n📝 Creating first admin user with:');
    console.log(`   Company: ${companyName}`);
    console.log(`   Name: ${firstName} ${lastName}`);
    console.log(`   Email: ${email}`);
    console.log(`   Date of Joining: ${dateOfJoining}\n`);

    // Generate employee ID
    function generateEmployeeId() {
      const prefix = 'EMP';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}-${randomNum}`;
    }

    let employeeId = generateEmployeeId();
    let exists = await User.findOne({ employeeId });
    while (exists) {
      employeeId = generateEmployeeId();
      exists = await User.findOne({ employeeId });
    }

    // Generate Login ID
    const joiningDate = new Date(dateOfJoining);
    const loginId = await generateLoginId(companyName, firstName, lastName, joiningDate);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await User.create({
      companyName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      employeeId,
      loginId,
      designation: 'Administrator',
      department: 'Administration',
      dateOfJoining: joiningDate,
      role: 'admin',
      isVerified: true,
      isPasswordChanged: true,
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log(`   Login ID: ${admin.loginId}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Employee ID: ${admin.employeeId}\n`);
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('⚠️  Delete /api/admin/create-first-admin route after use!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createFirstAdmin();

