import mongoose from 'mongoose';
import {
  User,
  Attendance,
  Document,
  EducationalBackground,
  Leave,
  LeaveBalance,
  PayrollRecord,
  PerformanceReview,
  Salary,
  Skill,
  WorkExperience
} from './models';

// --- CONFIGURATION ---
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://turbocpp:TurboCPP%402026@cluster0.2uctypo.mongodb.net/myDatabase?retryWrites=true&w=majority"; // Updated to use environment variable for connection string

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Setup IDs
    const employeeId = new mongoose.Types.ObjectId();
    const managerId = new mongoose.Types.ObjectId(); // Dummy manager ID
    
    // Delete existing user with same email to avoid duplicate key error
    await User.deleteOne({ email: "khushi.vorah@techcorp.in" });
    console.log(`Creating User: Khushi Vorah (ID: ${employeeId})`);

    // 2. Create the User (Employee)
    const user = await User.create({
      _id: employeeId,
      email: "khushi.vorah@techcorp.in",
      password: "$2b$10$EpRnTzVlqHNP0.fKbX9JV.X/Kqj.kO7/wQ.abc123hashedpassword", // Specific hash or placeholder
      loginId: "TC-2057",
      companyName: "TechCorp Solutions",
      role: "employee",
      isVerified: true,
      firstName: "Khushi",
      lastName: "Vorah",
      employeeId: "EMP057",
      dateOfBirth: new Date("1997-12-03"),
      gender: "female",
      maritalStatus: "single",
      nationality: "Indian",
      phoneNumber: "+91 9876543227",
      address: "906, Blue Sapphire, Mithakhali Six Roads, Ahmedabad, Gujarat",
      designation: "Business Analyst",
      department: "Business",
      dateOfJoining: new Date("2024-01-10"),
      employmentStatus: "active",
      managerId: managerId,
      status: "working"
    });

    // 3. Create Salary Structure
    // (Net Salary will be auto-calculated by your pre-save hook: 60+30+10-5 = 95k)
    await Salary.create({
      employeeId: employeeId,
      basicSalary: 60000,
      hra: 30000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 95000,
      salaryType: "monthly",
      bankAccountNumber: "123456789012",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      effectiveFrom: new Date("2023-01-10"),
      isActive: true
    });

    // 4. Create Skills
    await Skill.create([
      {
        employeeId: employeeId,
        skillName: "Node.js",
        proficiency: "expert",
        category: "Backend"
      },
      {
        employeeId: employeeId,
        skillName: "MongoDB",
        proficiency: "advanced",
        category: "Database"
      },
      {
        employeeId: employeeId,
        skillName: "React.js",
        proficiency: "intermediate",
        category: "Frontend"
      }
    ]);

    // 5. Create Educational Background
    await EducationalBackground.create([
      {
        employeeId: employeeId,
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        institution: "Gujarat Technological University",
        startDate: new Date("2013-08-01"),
        endDate: new Date("2017-05-30"),
        grade: "8.5 CGPA",
        isVerified: true
      }
    ]);

    // 6. Create Work Experience
    await WorkExperience.create([
      {
        employeeId: employeeId,
        companyName: "SoftWeb Systems",
        jobTitle: "Junior Developer",
        startDate: new Date("2017-07-01"),
        endDate: new Date("2020-12-31"),
        isCurrentJob: false,
        location: "Pune",
        description: "Worked on REST APIs and bug fixing."
      },
      {
        employeeId: employeeId,
        companyName: "Innovate Hub",
        jobTitle: "Backend Developer",
        startDate: new Date("2021-01-15"),
        endDate: new Date("2022-12-20"),
        isCurrentJob: false,
        location: "Bengaluru",
        achievements: "Reduced API latency by 40%."
      }
    ]);

    // 7. Create Documents
    await Document.create([
      {
        employeeId: employeeId,
        documentType: "resume",
        fileName: "Rohan_Mehta_Resume_2025.pdf",
        fileUrl: "https://bucket.s3.aws.com/uploads/rohan_resume.pdf",
        fileSize: 2048,
        uploadedBy: employeeId
      },
      {
        employeeId: employeeId,
        documentType: "pan",
        fileName: "PAN_Card.jpg",
        fileUrl: "https://bucket.s3.aws.com/uploads/pan_rohan.jpg",
        fileSize: 1024,
        uploadedBy: employeeId
      }
    ]);

    // 8. Create Leave Balance
    await LeaveBalance.create({
      employeeId: employeeId,
      paidLeave: 24,
      paidLeaveUsed: 4,
      sickLeave: 12,
      sickLeaveUsed: 1,
      unpaidLeave: 0
    });

    // 9. Create Attendance (Last 2 days)
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(today.getDate() - 2);

    // Note: Timestamps are set to create ~9 hours of work
    await Attendance.create([
      {
        employeeId: employeeId,
        date: dayBefore,
        checkInTime: new Date(dayBefore.setHours(9, 30, 0)),
        checkOutTime: new Date(dayBefore.setHours(18, 45, 0)),
        status: "present",
        location: "Office - Ahmedabad"
      },
      {
        employeeId: employeeId,
        date: yesterday,
        checkInTime: new Date(yesterday.setHours(9, 35, 0)),
        checkOutTime: new Date(yesterday.setHours(19, 0, 0)),
        status: "present",
        location: "Remote"
      }
    ]);

    // 10. Create a Leave Request
    await Leave.create({
      employeeId: employeeId,
      leaveType: "sick_leave",
      startDate: new Date("2024-02-10"),
      endDate: new Date("2024-02-11"),
      totalDays: 2,
      reason: "Viral fever",
      status: "approved",
      approvedBy: managerId,
      approvedAt: new Date("2024-02-09")
    });

    // 11. Create Performance Review
    await PerformanceReview.create({
      employeeId: employeeId,
      reviewPeriod: "2024-Q1",
      reviewDate: new Date("2024-04-01"),
      reviewedBy: managerId,
      rating: 4,
      strengths: "Excellent technical problem solving, fast learner.",
      areasForImprovement: "Documentation needs to be more detailed.",
      goals: "Lead the migration to Microservices architecture.",
      comments: "Rohan is a key asset to the backend team."
    });

    // 12. Create Payroll Record
    await PayrollRecord.create({
      employeeId: employeeId,
      month: 12,
      year: 2024,
      basicSalary: 60000,
      hra: 30000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 95000,
      status: "paid", // This will trigger your pre-save hook to calc netSalary
      processedAt: new Date("2024-12-31")
    });

    console.log("✅ Database populated successfully for user: Khushi Vorah");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seedData();