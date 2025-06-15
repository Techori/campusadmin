import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import all page components
import Sidebar from './components/Student/Sidebar';
import Dashboard from './components/Student/Dashboard';
import Profile from './components/Student/Profile';
import Jobs from './components/Student/Jobs';
import Applications from './components/Student/Applications';
import Interviews from './components/Student/Interviews';
import FeedbackCenter from './components/Student/Feedback';
import AIPortfolioSection from './components/Student/AIProfilePortfolio';
import { AuthPage } from './components/Student/AuthPage';
import Support from "./pages/Support";
import PlacementAnalysis from "./pages/PlacementAnalysis";
import EKysDashboard from "./pages/EKysDashboard";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import Signup from "../src/(auth)/signup";
import SignIn from "../src/(auth)/signin";

import DashboardCompany from './company_components/CompanyDashboard';
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

// Landing page component
import Index_Website from "./pages/Index_Website";
import Contact from "./pages/Contact";

// Layout for authenticated student pages (with sidebar)
const StudentLayout = ({ user, onLogout, sidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        user={user}
        onLogout={onLogout}
        sectionLabel="CAMPUS SERVICES"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header for Mobile */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-4 text-lg font-semibold">Rojgar Setu</h1>
          </div>
          <div className="flex items-center space-x-2">
            {user && (
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
            )}
            <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content rendered by <Outlet /> */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  // Sidebar and auth state for demo; you should connect your real auth logic here
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [loading, setLoading] = useState(true);

  // Demo: Set a fake user for sidebar and header
  useEffect(() => {
    setUser({ name: "Student User", email: "student@email.com" });
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    // Implement your logout logic
    setUser(null);
    // setIsAuthenticated(false);
    // localStorage.removeItem('studentId');
  };

  return (
    <Routes>
      {/* Student section with sidebar on ALL relevant pages */}
      <Route
        element={
          <StudentLayout
            user={user}
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/feedback" element={<FeedbackCenter />} />
        <Route path="/portfolio" element={<AIPortfolioSection />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chatbot" element={<chatbot />} />
        {/* add other student routes here */}
      </Route>

      {/* Public and other routes (no sidebar) */}
      <Route path="/" element={<Index_Website />} />
      <Route path="/login_panel" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/support" element={<Support />} />
      <Route path="/placement-analysis" element={<PlacementAnalysis />} />
      <Route path="/kyc-dashboard" element={<EKysDashboard />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/contact" element={<Contact />} />

      {/* Company Dashboard Routes */}
      <Route path="/company/:companyId/dashboard" element={<DashboardCompany />} />
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

      <Route path="/college-login" element={<CollegeLogin />} />
      <Route path="/company-login" element={<CompanyLogin />} />
      <Route path="/sales-login" element={<SalesLogin />} />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;