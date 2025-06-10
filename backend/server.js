const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const whitelist = [
  process.env.REACT_URL,
  'https://campusconnect-sumit-sahus-projects-83ef9bf1.vercel.app',
  'https://campusconnect-git-main-sumit-sahus-projects-83ef9bf1.vercel.app',
  'https://campusconnect-dk9xkuzk0-sumit-sahus-projects-83ef9bf1.vercel.app'
];
console.log("Links in CORS whitelist:");
for(element of whitelist){
  console.log(element);
}

app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Blocked by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Only enable if using cookies/auth headers
}));

app.use(express.json());



// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
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
  console.log(`Connected to Database: ${process.env.MONGO_URI} | ${formattedDate}`);
  
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});





// Routers
const authRoutes = require('./routes/auth');
const jobsRoute = require('./routes/jobs');
const internshipsRoute = require('./routes/internships');
const interviewsRoute = require('./routes/interviews');
const applicationRoutes = require('./routes/applications');
const companyRoutes = require('./routes/company');
const rolesRoute = require('./routes/roles');
const employeesRoute = require('./routes/employees');
const collegeRoutes = require('./routes/colleges');
const studentRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoute);
app.use('/api/internships', internshipsRoute);
app.use('/api/interviews', interviewsRoute);
app.use('/api/applications', applicationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/roles', rolesRoute);
app.use('/api/employees', employeesRoute);
app.use('/api/colleges', collegeRoutes);
app.use('/api/students', studentRoutes)
// REST API Endpoints

// app.get('/api/students/college/:collegeId') .....Get all students for a college
// app.post('/api/students/bulk') .....Post, insert bulk students by college
// app.get('/api/students/:id') .....Get student details by id


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});