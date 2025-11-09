

import './App.css';
import { Routes, Route } from 'react-router-dom';

// Registration & Login
import RegistrationForm from './Registration_Dashboard/RegistrationForm';
import LoginForm from './Registration_Dashboard/LoginForm';
import ForgotPasswordForm from './Registration_Dashboard/ForgotPasswordForm';
import SendResetMail from './Registration_Dashboard/SendResetMail';

// Student Dashboard
import StudentDashboard from './Student_Dashboard/StudentDashboard';
import Dashboard from './Student_Dashboard/Dashboard';
import StartInterview from './Student_Dashboard/StartInterview';
import MockInterview from './Student_Dashboard/MockInterview';
import StudentNavbar from './Student_Dashboard/StudentNavbar';
import StudentProfile from './Student_Dashboard/Studentprofile';
 



// Admin Dashboard
import AdminDashboard from './Admin_Dashboard/AdminDashboard';
import AdminProfile from './Admin_Dashboard/AdminProfile';
import CourseManagement from './Admin_Dashboard/CourseManagement';
import BatchManagement from './Admin_Dashboard/BatchManagement';
import QuestionBank from './Admin_Dashboard/QuestionBank';
import Category from './Admin_Dashboard/CreateCategory';
import CreateTopic from './Admin_Dashboard/CreateTopic';
import CreateSubTopic from './Admin_Dashboard/CreateSubTopic';
import UserManagement from './Admin_Dashboard/UserManagement';
import ManageRolls from './Admin_Dashboard/ManageRolls'; 

function App() {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/sendresetmail" element={<SendResetMail />} />
      <Route path="/reset-password" element={<ForgotPasswordForm />} />
      <Route path="/start-interview" element={<StartInterview />} />
      <Route path="/studentnavbar" element={<StudentNavbar />} />
      <Route path="/student-profile" element={<StudentProfile />} />

    
      
  
        {/* Student Dashboard with nested routes */}
        <Route path="/student-dashboard" element={<StudentDashboard/>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mock-interview" element={<MockInterview />} />
        </Route>


        {/* Admin Dashboard with nested routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<CourseManagement />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="category" element={<Category />} />
          <Route path="topic" element={<CreateTopic />} />
          <Route path="sub-topic" element={<CreateSubTopic />} />
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="manage-rolls" element={<ManageRolls/>} />
          <Route path="" element={<CourseManagement />} />

        </Route>

        {/* Fallback route (optional) */}
        <Route path="*" element={<h2 className="text-center my-5">Page Not Found</h2>} />



      </Routes>
    </>
  )
}

export default App;
