require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

// Import route modules
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const studentMatchingRoutes = require('./routes/studentMatchingRoutes');

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

// Configure email transport
const emailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://campusadmin-y4hh.vercel.app',
  'https://campusadmin.vercel.app',
  'https://campusconnect-sumit-sahus-projects-83ef9bf1.vercel.app',
  'https://campusconnect-git-main-sumit-sahus-projects-83ef9bf1.vercel.app',
  'https://campusconnect-dk9xkuzk0-sumit-sahus-projects-83ef9bf1.vercel.app'
];
if (process.env.REACT_URL) allowedOrigins.push(process.env.REACT_URL);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedAllowedOrigins = allowedOrigins.map(o => o.replace(/\/$/, ''));
    if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS not allowed for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  optionsSuccessStatus: 200,
}));
console.log('CORS Allowed Origins:', allowedOrigins);
// app.options('*', cors());

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
  console.log(`Connected to Database: ${process.env.MONGODB_URI} | ${formattedDate} | ${process.env.MONGODB_URI}`);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process if DB connection fails
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

// REST API Endpoints

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production', // Enable in prod with HTTPS
  }
}));

// Serve static files (profile images, documents) Kishori's part
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/student-matching', studentMatchingRoutes);

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

// Error handling middleware (improved feedback)
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