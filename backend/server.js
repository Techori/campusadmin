require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { passport } = require('./config/auth');

// Import route modules
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');
const notificationRoutes = require('./routes/notifications');

// College and Company models
const CollegeStudent = require('./models/collegeStudent.model');
const Role = require('./models/Role');
const Company = require('./models/Company');
const Application = require('./models/CollegeApplication');
const StudentRegister = require('./models/StudentRegister');
const College = require('./models/College');
const Employee = require('./models/Employee');
const bcrypt = require('bcrypt');
const RegistrationOtp = require('./models/RegistrationOtp');
const Job = require('./models/Job');
const Internship = require('./models/Internship');
const Interview = require('./models/Interview');
const Review = require('./models/Review');
require('dotenv').config;
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();




// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['Set-Cookie']
}));

// Initialize Passport
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const formattedDate = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  console.log(`Connected to Database: ${process.env.MONGODB_URI} | ${formattedDate}`);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('MongoDB connection established successfully');
});

//specific  Routers for collge-company, Sumit's part
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/company', require('./routes/company'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/employees',require('./routes/employees'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/students', require('./routes/students'))
app.use('/api/support', require('./routes/support'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

//Raj Sir part
app.use('/api/student', require('./routes/studentRegister'));
app.post('/api/college-students/email', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Verifying student:', email);
    

    const student = await StudentRegister.findOne({ contactEmail: email });
    if (!student) {
      console.log('Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }

    // Compare hashed password
    var isMatch = await bcrypt.compare(password, student.password);
    if(!isMatch)
      isMatch = (password.includes(student.password))
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Student verified successfully');
    const { password: pw, ...studentData } = student.toObject();
    res.json({
      user: {
        id: studentData._id,
        email: studentData.contactEmail,
        name: studentData.studentName,
      }
    });
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({ error: 'Error verifying credentials' });
  }
});

// Health check/test route
app.get('/', (req, res) => {
  res.send('Backend running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Routes (Sales and Support)
app.use('/api/v1/user', require('./routes/user')); // Fixed path by adding leading '/'
app.use('/api/v1/placement', require('./routes/placement')); // Fixed path  