import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    }
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    middleName: {
      type: String,
      trim: true,
      default: ''
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required']
    },
    birthDate: {
      type: Date,
      required: [true, 'Birth date is required']
    },
    civilStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
      required: [true, 'Civil status is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      index: true
    },
    dateHired: {
      type: Date,
      required: [true, 'Date hired is required']
    },
    employmentStatus: {
      type: String,
      enum: ['Regular', 'Probationary', 'Contractual'],
      required: [true, 'Employment status is required']
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: [true, 'Emergency contact information is required']
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    archivedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for search optimization
employeeSchema.index({ firstName: 1, lastName: 1 });
employeeSchema.index({ department: 1, position: 1 });

// Pre-save hook to generate employee ID if not provided
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;