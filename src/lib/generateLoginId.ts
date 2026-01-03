import connectDB from './db';
import { User } from '@/models/user';

/**
 * Generate Login ID in format: LOI (First 2 letters of company) (First 2 letters of first name + last name) (year) (serial number)
 * Example: OIJODO20220001
 * - OI = Odoo India (Company Name)
 * - JODO = First two letters of first name and last name
 * - 2022 = Year of Joining
 * - 0001 = Serial Number of Joining for that Year
 */
export async function generateLoginId(
  companyName: string,
  firstName: string,
  lastName: string,
  dateOfJoining: Date
): Promise<string> {
  await connectDB();

  // Get first 2 letters of company name (uppercase)
  const companyPrefix = companyName.substring(0, 2).toUpperCase();

  // Get first 2 letters of first name and last name (uppercase)
  const namePrefix = (
    firstName.substring(0, 2) + lastName.substring(0, 2)
  ).toUpperCase();

  // Get year of joining
  const year = dateOfJoining.getFullYear().toString();

  // Find the highest serial number for this company and year
  const existingUsers = await User.find({
    companyName: companyName,
    dateOfJoining: {
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    },
  }).sort({ loginId: -1 });

  let serialNumber = 1;
  if (existingUsers.length > 0) {
    // Extract serial number from existing login IDs
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

  // Format serial number with leading zeros (4 digits)
  let serialStr = serialNumber.toString().padStart(4, '0');

  // Construct Login ID: LOI + Company + Name + Year + Serial
  let loginId = `LOI${companyPrefix}${namePrefix}${year}${serialStr}`;

  // Check if this login ID already exists (shouldn't happen, but safety check)
  let exists = await User.findOne({ loginId });
  let attempts = 0;
  while (exists && attempts < 100) {
    serialNumber++;
    serialStr = serialNumber.toString().padStart(4, '0');
    loginId = `LOI${companyPrefix}${namePrefix}${year}${serialStr}`;
    exists = await User.findOne({ loginId });
    attempts++;
  }

  if (attempts >= 100) {
    throw new Error('Unable to generate unique Login ID. Please try again.');
  }

  return loginId;
}

/**
 * Generate a random secure password
 */
export function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

