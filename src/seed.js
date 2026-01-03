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
const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://turbocpp:TurboCPP%402026@cluster0.2uctypo.mongodb.net/myDatabase?retryWrites=true&w=majority";

async function seedKhushiVorah() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Setup IDs
    const employeeId = new mongoose.Types.ObjectId();
    const managerId = new mongoose.Types.ObjectId();

    await User.deleteOne({ email: "khushi.vorah@techcorp.in" });
    console.log(`Creating User: Khushi Vorah (ID: ${employeeId})`);

    // 2. Create User
    await User.create({
      _id: employeeId,
      email: "khushi.vorah@techcorp.in",
      password: "$2b$10$KhushiDummyHash1234567890",
      loginId: "TC-2071",
      companyName: "TechCorp Solutions",
      role: "employee",
      isVerified: true,
      firstName: "Khushi",
      lastName: "Vorah",
      employeeId: "EMP071",
      dateOfBirth: new Date("1999-03-22"),
      gender: "female",
      maritalStatus: "single",
      nationality: "Indian",
      phoneNumber: "+91 9876548999",
      address: "B-302, Shivalik Residency, Bodakdev, Ahmedabad",
      designation: "Backend Developer",
      department: "Engineering",
      dateOfJoining: new Date("2022-11-14"),
      employmentStatus: "active",
      managerId,
      status: "working"
    });

    // 3. Salary
    await Salary.create({
      employeeId,
      basicSalary: 55000,
      hra: 25000,
      allowances: 8000,
      deductions: 4000,
      netSalary: 84000,
      salaryType: "monthly",
      bankAccountNumber: "987654321012",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0005678",
      effectiveFrom: new Date("2022-11-14"),
      isActive: true
    });

    // 4. Skills
    await Skill.create([
      { employeeId, skillName: "Java", proficiency: "advanced", category: "Backend" },
      { employeeId, skillName: "Spring Boot", proficiency: "advanced", category: "Backend" },
      { employeeId, skillName: "PostgreSQL", proficiency: "intermediate", category: "Database" }
    ]);

    // 5. Education
    await EducationalBackground.create([
      {
        employeeId,
        degree: "B.E.",
        fieldOfStudy: "Information Technology",
        institution: "L.D. College of Engineering",
        startDate: new Date("2016-08-01"),
        endDate: new Date("2020-06-15"),
        grade: "8.2 CGPA",
        isVerified: true
      }
    ]);

    // 6. Work Experience
    await WorkExperience.create([
      {
        employeeId,
        companyName: "CodeNest Pvt Ltd",
        jobTitle: "Software Engineer",
        startDate: new Date("2020-07-01"),
        endDate: new Date("2022-10-31"),
        isCurrentJob: false,
        location: "Ahmedabad",
        achievements: "Implemented microservices-based authentication system."
      }
    ]);

    // 7. Documents
    await Document.create([
      {
        employeeId,
        documentType: "resume",
        fileName: "Khushi_Vorah_Resume_2025.pdf",
        fileUrl: "https://bucket.s3.aws.com/uploads/khushi_resume.pdf",
        fileSize: 2100,
        uploadedBy: employeeId
      },
      {
        employeeId,
        documentType: "aadhar",
        fileName: "Aadhar_Card.pdf",
        fileUrl: "https://bucket.s3.aws.com/uploads/aadhar_khushi.pdf",
        fileSize: 1500,
        uploadedBy: employeeId
      }
    ]);

    // 8. Leave Balance
    await LeaveBalance.create({
      employeeId,
      paidLeave: 24,
      paidLeaveUsed: 6,
      sickLeave: 12,
      sickLeaveUsed: 2,
      unpaidLeave: 0
    });

    // 9. Attendance (Last 2 days)
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(today.getDate() - 2);

    await Attendance.create([
      {
        employeeId,
        date: dayBefore,
        checkInTime: new Date(dayBefore.setHours(9, 45, 0)),
        checkOutTime: new Date(dayBefore.setHours(18, 30, 0)),
        status: "present",
        location: "Office - Ahmedabad"
      },
      {
        employeeId,
        date: yesterday,
        checkInTime: new Date(yesterday.setHours(10, 0, 0)),
        checkOutTime: new Date(yesterday.setHours(18, 15, 0)),
        status: "present",
        location: "Remote"
      }
    ]);

    // 10. Leave
    await Leave.create({
      employeeId,
      leaveType: "paid_leave",
      startDate: new Date("2024-03-15"),
      endDate: new Date("2024-03-16"),
      totalDays: 2,
      reason: "Family function",
      status: "approved",
      approvedBy: managerId,
      approvedAt: new Date("2024-03-14")
    });

    // 11. Performance Review
    await PerformanceReview.create({
      employeeId,
      reviewPeriod: "2024-Q2",
      reviewDate: new Date("2024-07-01"),
      reviewedBy: managerId,
      rating: 4.5,
      strengths: "Strong backend design skills, excellent ownership.",
      areasForImprovement: "Can improve DevOps knowledge.",
      goals: "Lead backend scalability initiatives.",
      comments: "Khushi consistently delivers high-quality code."
    });

    // 12. Payroll
    await PayrollRecord.create({
      employeeId,
      month: 12,
      year: 2024,
      basicSalary: 55000,
      hra: 25000,
      allowances: 8000,
      deductions: 4000,
      netSalary: 84000,
      status: "paid",
      processedAt: new Date("2024-12-31")
    });

    console.log("✅ Database populated successfully for user: Khushi Vorah");

  } catch (err) {
    console.error("❌ Error seeding Khushi Vorah:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seedData();
