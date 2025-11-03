import './App.css'
import { Routes, Route } from 'react-router-dom'

// Registration & Login
import RegistrationForm from './Registration_Dashboard/RegistrationForm';
import LoginForm from './Registration_Dashboard/LoginForm';
import ForgotPasswordForm from './Registration_Dashboard/ForgotPasswordForm';
import SendResetMail from './Registration_Dashboard/SendResetMail';

// Student Dashboard
import Dashboard from './Student_Dashboard/Dashboard';
import StudentDashboard from './Student_Dashboard/StudentDashboard';
import StartInterview from './Student_Dashboard/StartInterview';

// Admin Dashboard
import AdminDashboard from './Admin_Dashboard/AdminDashboard';
import CourseManagement from './Admin_Dashboard/CourseManagement';
import BatchManagement from './Admin_Dashboard/BatchManagement';
import QuestionBank from './Admin_Dashboard/QuestionBank';
import StudentNavbar from './Student_Dashboard/StudentNavbar';
import Category from './Admin_Dashboard/CreateCategory';
import CreateTopic from './Admin_Dashboard/CreateTopic';
import CreateSubTopic from './Admin_Dashboard/CreateSubTopic';
import UserManagement from './Admin_Dashboard/UserManagement';
 
   
function App() {
  return (
    <>
      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<RegistrationForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/sendresetmail' element={<SendResetMail />} />
        <Route path='/reset-password' element={<ForgotPasswordForm />} />
        <Route path='/start-interview' element={<StartInterview />} />
        <Route path='/studentnavbar' element={<StudentNavbar />} />

 
         
       
        {/* Student Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<StudentDashboard />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />
        </Route>


        {/* Admin Dashboard with nested routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<CourseManagement />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="category" element={<Category/>} />     
          <Route path="topic" element={<CreateTopic/>} />
          <Route path="sub-topic" element={<CreateSubTopic/>} />  
          <Route path="usermanagement" element={<UserManagement/>} />
        

        </Route>

        {/* Fallback route (optional) */}
        <Route path="*" element={<h2 className="text-center my-5">Page Not Found</h2>} />



       </Routes>
    </>
  )
}

export default App

 
 