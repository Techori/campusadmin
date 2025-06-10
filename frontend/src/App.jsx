import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './company_components/CompanyDashboard';
import CollegeDashboard from './college_components/CollegeDashboard';
import PostJobForm from './company_components/PostJobForm';
import ScheduledInterviews from './company_components/ScheduledInterviews';
import StudentProfile from './company_components/StudentProfile';
import ViewApplications from './company_components/ViewApplications';
import Analytics from './company_components/Analytics';
import CollegeProfile from './college_components/CollegeProfile';
import ViewJobs from './college_components/ViewJobs';
import ScheduledApplications from './college_components/ScheduledApplications';
import Login from './Login';
import CollegeLogin from './college_components/CollegeLogin';
import StudentLogin from './student_components/StudentLogin';
import CompanyLogin from './company_components/CompanyLogin';
import SalesLogin from './sales_components/SalesLogin';
import AddStudents from './college_components/AddStudents';
import ManageEmployees from './company_components/ManageEmployees';

import CollegeSupport from './college_components/Support';
import CollegePlacementAnalysis from './college_components/PlacementAnalysis';
import CompanySupport from './company_components/Support';
import CompanyPlacementAnalysis from './company_components/PlacementAnalysis';
// import Navbar from './Navbar'; // REMOVE global Navbar


function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/*" element={<Login />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/college-login" element={<CollegeLogin />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/sales-login" element={<SalesLogin />} />

        {/* Company Dashboard Routes */}
        <Route path="/company/:companyId/dashboard" element={<Dashboard />} />
        <Route path="/company/:companyId/post-job" element={<PostJobForm />} />
        <Route path="/company/:companyId/scheduled-interviews" element={<ScheduledInterviews />} />
        <Route path="/company/:companyId/applications" element={<ViewApplications />} />
        <Route path="/company/:companyId/support" element={<CompanySupport />} />
        <Route path="/company/:companyId/placement-analysis" element={<CompanyPlacementAnalysis />} />
        <Route path="/company/:companyId/employees" element={<ManageEmployees />} />

        {/* College Dashboard Routes */}
        <Route path="/college/:collegeId/dashboard" element={<CollegeDashboard />} />
        <Route path="/college/:collegeId/view-jobs" element={<ViewJobs />} />
        <Route path="/college/:collegeId/scheduled-applications" element={<ScheduledApplications />} />
        <Route path="/college/:collegeId/add-students" element={<AddStudents />} />
        <Route path="/college/:collegeId/analytics" element={<Analytics />} />
        <Route path="/college/:collegeId/support" element={<CollegeSupport />} />
        <Route path="/college/:collegeId/placement-analysis" element={<CollegePlacementAnalysis />} />

        {/* Profile Routes */}
        <Route path="/student/:studentId" element={<StudentProfile />} />
        <Route path="/college/:collegeId/student/:studentId" element={<CollegeProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
