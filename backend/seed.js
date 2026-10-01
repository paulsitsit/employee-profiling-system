import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';

dotenv.config();

// Sample data
const adminUser = {
  name: 'Admin User',
  email: 'admin@company.com',
  password: 'admin123',
  role: 'admin'
};

const sampleEmployees = [
  {
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    gender: 'Male',
    birthDate: '1990-05-15',
    civilStatus: 'Married',
    address: '123 Rizal St, Brgy. San Roque, Quezon City',
    contactNumber: '+63 917 123 0101',
    email: 'juan.delacruz@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    dateHired: '2022-03-10',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Maria Dela Cruz',
      relationship: 'Spouse',
      phone: '+63 917 123 0102'
    }
  },
  {
    firstName: 'Maria Clara',
    middleName: 'Reyes',
    lastName: 'Villanueva',
    gender: 'Female',
    birthDate: '1992-08-22',
    civilStatus: 'Single',
    address: '456 Mabini Ave, Brgy. Poblacion, Makati City',
    contactNumber: '+63 918 234 0201',
    email: 'maria.villanueva@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    dateHired: '2021-06-15',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Roberto Villanueva',
      relationship: 'Father',
      phone: '+63 918 234 0202'
    }
  },
  {
    firstName: 'Jose',
    middleName: 'Garcia',
    lastName: 'Bautista',
    gender: 'Male',
    birthDate: '1988-12-03',
    civilStatus: 'Married',
    address: '789 Bonifacio Rd, Brgy. Lahug, Cebu City',
    contactNumber: '+63 919 345 0301',
    email: 'jose.bautista@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    dateHired: '2020-09-01',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Elena Bautista',
      relationship: 'Spouse',
      phone: '+63 919 345 0302'
    }
  },
  {
    firstName: 'Angelica',
    middleName: 'Mendoza',
    lastName: 'Ramos',
    gender: 'Female',
    birthDate: '1995-04-18',
    civilStatus: 'Single',
    address: '321 Luna St, Brgy. Magsaysay, Davao City',
    contactNumber: '+63 920 456 0401',
    email: 'angelica.ramos@company.com',
    department: 'Human Resources',
    position: 'HR Specialist',
    dateHired: '2023-01-20',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Lourdes Ramos',
      relationship: 'Mother',
      phone: '+63 920 456 0402'
    }
  },
  {
    firstName: 'Miguel',
    middleName: 'Aquino',
    lastName: 'Castillo',
    gender: 'Male',
    birthDate: '1991-07-30',
    civilStatus: 'Married',
    address: '654 Del Pilar Dr, Brgy. Tetuan, Zamboanga City',
    contactNumber: '+63 921 567 0501',
    email: 'miguel.castillo@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    dateHired: '2022-11-05',
    employmentStatus: 'Probationary',
    emergencyContact: {
      name: 'Rosario Castillo',
      relationship: 'Spouse',
      phone: '+63 921 567 0502'
    }
  },
  {
    firstName: 'Jasmine',
    middleName: 'Flores',
    lastName: 'Navarro',
    gender: 'Female',
    birthDate: '1993-02-14',
    civilStatus: 'Single',
    address: '987 Aguinaldo Ln, Brgy. San Antonio, Pasig City',
    contactNumber: '+63 922 678 0601',
    email: 'jasmine.navarro@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    dateHired: '2021-08-12',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Carlo Navarro',
      relationship: 'Brother',
      phone: '+63 922 678 0602'
    }
  },
  {
    firstName: 'Ramon',
    middleName: 'Lopez',
    lastName: 'Pascual',
    gender: 'Male',
    birthDate: '1989-11-25',
    civilStatus: 'Divorced',
    address: '147 Quezon Blvd, Brgy. Tinago, Iloilo City',
    contactNumber: '+63 923 789 0701',
    email: 'ramon.pascual@company.com',
    department: 'Engineering',
    position: 'QA Engineer',
    dateHired: '2023-04-03',
    employmentStatus: 'Contractual',
    emergencyContact: {
      name: 'Ana Pascual',
      relationship: 'Sister',
      phone: '+63 923 789 0702'
    }
  },
  {
    firstName: 'Katrina',
    middleName: 'Domingo',
    lastName: 'Soriano',
    gender: 'Female',
    birthDate: '1994-06-08',
    civilStatus: 'Married',
    address: '258 Osmeña St, Brgy. Capitol Site, Bacolod City',
    contactNumber: '+63 925 890 0801',
    email: 'katrina.soriano@company.com',
    department: 'Marketing',
    position: 'Content Specialist',
    dateHired: '2022-07-18',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Paolo Soriano',
      relationship: 'Spouse',
      phone: '+63 925 890 0802'
    }
  },
  {
    firstName: 'Carlos',
    middleName: 'Tolentino',
    lastName: 'Mercado',
    gender: 'Male',
    birthDate: '1987-09-12',
    civilStatus: 'Married',
    address: '369 Roxas Ct, Brgy. Pacita, San Pedro, Laguna',
    contactNumber: '+63 926 901 0901',
    email: 'carlos.mercado@company.com',
    department: 'IT Support',
    position: 'IT Manager',
    dateHired: '2019-05-22',
    employmentStatus: 'Regular',
    emergencyContact: {
      name: 'Patricia Mercado',
      relationship: 'Spouse',
      phone: '+63 926 901 0902'
    }
  },
  {
    firstName: 'Bianca',
    middleName: 'Cruz',
    lastName: 'Gonzales',
    gender: 'Female',
    birthDate: '1996-01-28',
    civilStatus: 'Single',
    address: '741 Burgos Blvd, Brgy. Balibago, Angeles City, Pampanga',
    contactNumber: '+63 927 012 1001',
    email: 'bianca.gonzales@company.com',
    department: 'Human Resources',
    position: 'Recruiter',
    dateHired: '2023-09-01',
    employmentStatus: 'Probationary',
    emergencyContact: {
      name: 'Susan Gonzales',
      relationship: 'Mother',
      phone: '+63 927 012 1002'
    }
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log(`✅ Admin user created: ${admin.email}`);

    // Create sample employees
    const employees = await Employee.insertMany(sampleEmployees);
    console.log(`✅ Created ${employees.length} sample employees`);

    // Archive one employee for testing
    if (employees.length > 0) {
      employees[0].isArchived = true;
      employees[0].archivedAt = new Date();
      await employees[0].save();
      console.log('📦 Archived 1 employee for testing');
    }

    console.log('\n🎉 Seeding completed successfully!\n');
    console.log('📝 Login credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();