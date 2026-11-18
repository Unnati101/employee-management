import { toISODate } from '@/lib/format';
import type { Department, Employee, EmployeeStatus } from '@/types';

// MOCK DATA: sample records for demonstration only. Replace with a real API in src/services.

type SeedRow = [
  firstName: string,
  lastName: string,
  department: Department,
  role: string,
  status: EmployeeStatus,
  salary: number,
  daysAgo: number,
  location: string,
];

const SEED_ROWS: SeedRow[] = [
  ['Amelia', 'Hart', 'Engineering', 'Staff Software Engineer', 'Active', 168000, 1620, 'San Francisco, CA'],
  ['Rohan', 'Mehta', 'Engineering', 'Senior Frontend Engineer', 'Active', 142000, 940, 'Austin, TX'],
  ['Sofia', 'Alvarez', 'Design', 'Principal Product Designer', 'Active', 135000, 1210, 'New York, NY'],
  ['Liam', 'O\'Connor', 'Sales', 'Account Executive', 'Active', 98000, 480, 'Chicago, IL'],
  ['Priya', 'Nair', 'Human Resources', 'HR Business Partner', 'Active', 91000, 760, 'Seattle, WA'],
  ['Noah', 'Fischer', 'Finance', 'Financial Analyst', 'On Leave', 87000, 590, 'Boston, MA'],
  ['Chloe', 'Dubois', 'Marketing', 'Content Strategist', 'Active', 84000, 310, 'Denver, CO'],
  ['Mateo', 'Silva', 'Operations', 'Operations Manager', 'Active', 105000, 1380, 'Miami, FL'],
  ['Hannah', 'Kim', 'Engineering', 'Backend Engineer', 'Active', 128000, 215, 'Seattle, WA'],
  ['Omar', 'Haddad', 'Engineering', 'DevOps Engineer', 'Active', 133000, 400, 'Austin, TX'],
  ['Grace', 'Lee', 'Design', 'UX Researcher', 'Active', 99000, 150, 'Portland, OR'],
  ['Ethan', 'Brooks', 'Sales', 'Sales Development Rep', 'Inactive', 62000, 700, 'Atlanta, GA'],
  ['Isabella', 'Rossi', 'Marketing', 'Marketing Director', 'Active', 138000, 1500, 'Los Angeles, CA'],
  ['Arjun', 'Kapoor', 'Finance', 'Finance Controller', 'Active', 122000, 1100, 'New York, NY'],
  ['Zoe', 'Bennett', 'Human Resources', 'Talent Acquisition Lead', 'Active', 94000, 75, 'Remote'],
  ['Lucas', 'Meyer', 'Engineering', 'QA Engineer', 'On Leave', 89000, 520, 'Denver, CO'],
  ['Maya', 'Patel', 'Operations', 'Supply Chain Analyst', 'Active', 78000, 40, 'Chicago, IL'],
  ['Daniel', 'Okafor', 'Sales', 'Regional Sales Manager', 'Active', 118000, 880, 'Houston, TX'],
  ['Elena', 'Petrova', 'Design', 'Visual Designer', 'Active', 86000, 20, 'Remote'],
  ['Jack', 'Sullivan', 'Engineering', 'Engineering Manager', 'Active', 172000, 1750, 'San Francisco, CA'],
  ['Nina', 'Yamamoto', 'Marketing', 'Growth Marketer', 'Active', 81000, 110, 'Seattle, WA'],
  ['Victor', 'Alonso', 'Operations', 'Facilities Coordinator', 'Inactive', 58000, 1300, 'Miami, FL'],
  ['Aisha', 'Rahman', 'Finance', 'Accounts Payable Specialist', 'Active', 67000, 260, 'Boston, MA'],
  ['Tom', 'Gallagher', 'Engineering', 'Data Engineer', 'Active', 139000, 55, 'Remote'],
  ['Leila', 'Haddad', 'Human Resources', 'People Operations Specialist', 'Active', 72000, 340, 'Austin, TX'],
  ['Ben', 'Carter', 'Sales', 'Customer Success Manager', 'Active', 92000, 640, 'Denver, CO'],
];

export function createSeedEmployees(now: Date = new Date()): Employee[] {
  return SEED_ROWS.map(([firstName, lastName, department, role, status, salary, daysAgo, location], index) => ({
    id: `seed-${index + 1}`,
    firstName,
    lastName,
    email: `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, '') + '@aurelia.example',
    phone: `+1 555 01${String(index + 10).padStart(2, '0')}`,
    department,
    role,
    status,
    salary,
    joinDate: toISODate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo)),
    location,
  }));
}
