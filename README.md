# Project Overview

This project is a full-stack application with a Node.js/Express backend and a React/Vite frontend. It provides dashboards and features for companies, colleges, students, and sales roles.

## Backend

- **Technology**: Node.js, Express, MongoDB
- **Main Features**:
  - REST API endpoints for authentication, jobs, internships, interviews, applications, companies, roles, employees, colleges, and students.
  - Uses Mongoose for MongoDB interactions.
  - CORS configuration to allow specific origins.
  - Environment variables managed via dotenv.

## Frontend

- **Technology**: React, Vite
- **Main Features**:
  - Multi-role dashboards (Company, College, Student, Sales).
  - Features include job posting, analytics, support, and profile management.
  - Uses React Router for navigation.

## Getting Started

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start or node server.js
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- **Backend**:
  - `server.js`: Main entry point for the Express server.
  - `routes/`: Contains API route definitions.
  - `models/`: Mongoose models for database interactions.
  - `config/`: Configuration files.
  - `utils/`: Utility functions.
  - `tests/`: Test files.
  - `scripts/`: Helper scripts.

- **Frontend**:
  - `src/`: Main source code.
    - `components/`: Reusable React components.
    - `company_components/`, `college_components/`, `student_components/`, `sales_components/`: Role-specific components.
    - `utils/`: Utility functions.
  - `public/`: Static assets.
  - `index.html`: Entry HTML file.

## Directory Structure

```
.
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── employees.js
│   │   ├── colleges.js
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── interviews.js
│   │   ├── company.js
│   │   ├── roles.js
│   │   ├── applications.js
│   │   ├── jobs.js
│   │   └── internships.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── CollegeStudent.model.js
│   │   ├── Role.js
│   │   ├── Review.js
│   │   ├── RegistrationOtp.js
│   │   ├── Job.js
│   │   ├── Interview.js
│   │   ├── Internship.js
│   │   ├── Employee.js
│   │   ├── Company.js
│   │   └── College.js
│   ├── config/
│   │   └── email.js
│   ├── utils/
│   │   └── zoomOAuth.js
│   ├── tests/
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LoginForm.jsx
│   │   ├── company_components/
│   │   │   ├── ViewApplications.jsx
│   │   │   ├── CompanyLogin.jsx
│   │   │   ├── ManageEmployees.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── ScheduledInterviews.jsx
│   │   │   ├── ScheduledInterviews.css
│   │   │   ├── Support.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   ├── PostJobForm.jsx
│   │   │   ├── PlacementAnalysis.jsx
│   │   │   ├── CompanyLogin.css
│   │   │   └── Analytics.jsx
│   │   ├── college_components/
│   │   │   ├── CollegeProfile.jsx
│   │   │   ├── CollegeLogin.jsx
│   │   │   ├── ViewJobs.jsx
│   │   │   ├── CollegeDashboard.jsx
│   │   │   ├── AddStudents.jsx
│   │   │   ├── ScheduledApplications.jsx
│   │   │   ├── Support.jsx
│   │   │   ├── StudentPerformanceChart.jsx
│   │   │   ├── PlacementAnalysis.jsx
│   │   │   ├── CollegeLogin.css
│   │   │   └── AverageSummaryChart.jsx
│   │   ├── student_components/
│   │   ├── sales_components/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── eslint.config.js
│   ├── .env
│   └── README.md
└── README.md
```

## Additional Information

- The backend uses environment variables for configuration (see `.env` file).
- The frontend is built with Vite for fast development and optimized production builds. 