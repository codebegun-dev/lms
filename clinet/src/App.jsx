import './App.css';
import { Routes, Route } from 'react-router-dom';


// Registration & Login
import RegistrationForm from './Registration_Dashboard/RegistrationForm';
import LoginForm from './Registration_Dashboard/LoginForm';
import ForgotPasswordForm from './Registration_Dashboard/ForgotPasswordForm';
import SendResetMail from './Registration_Dashboard/SendResetMail';
import ViewProgress from './Student_Dashboard/ViewProgress';
 

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
import UserManagement from "./Admin_Dashboard/UserManagement/UserManagement.jsx";
import ManageRoles from './Admin_Dashboard/ManageRoles'; 
import Syllabus from './Admin_Dashboard/Syllabus';
import EditArticle from './Admin_Dashboard/EditArticle';
import AddSection from './Admin_Dashboard/ContentTypeModal';

// Sales Dashboard
import SalesForm from './Sales_Dashboard/SalesForm';
import SalesDashboard from './Sales_Dashboard/SalesDashboard';
import LeadsList from "./Sales_Dashboard/LeadsList";
import SalesProfile from './Sales_Dashboard/SalesProfile';
import BulkUpload from './Sales_Dashboard/BulkUpload';


// Sales Counselor Dashboard
import SalesCounselorDashboard from './Sales_Dashboard/Sales_Counselor/SalesCounselorDashboard';
import CounselorProfile from "./Sales_Dashboard/Sales_Counselor/CounselorProfile";


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
      <Route path="/view-progress" element={<ViewProgress />} />    
       
  
        {/* Student Dashboard with nested routes */}
        <Route path="/student-dashboard" element={<StudentDashboard/>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mock-interview" element={<MockInterview />} />
        </Route>


        {/* Admin Dashboard with nested routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<CourseManagement />} />
          <Route path="admin-profile" element={<AdminProfile />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="category" element={<Category />} />
          <Route path="topic" element={<CreateTopic />} />
          <Route path="sub-topic" element={<CreateSubTopic />} />
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="manage-roles" element={<ManageRoles/>} />
          <Route path='syllabus' element={<Syllabus/>} />       
          <Route path="edit-article" element={<EditArticle/>} />
          <Route path="add-section" element={<AddSection/>} />
          <Route path="" element={<CourseManagement />} />
          <Route path="admin-profile" element={<AdminProfile />} />
        </Route>
        

        {/* Sales Dashboard */}
        <Route path="/sales-dashboard" element={<SalesDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="add-enquiry" element={<SalesForm />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="myprofile" element={<SalesProfile />} />
          <Route path="bulkupload" element={<BulkUpload />} />
        </Route>


        {/* Sales Counselor Dashboard */}
        <Route path="/sales-counselor" element={<SalesCounselorDashboard />}>
          <Route index element={<h2>Welcome Counselor</h2>} />
          <Route path="myprofile" element={<CounselorProfile />} />
        </Route>


        {/* Fallback route (optional) */}
        <Route path="*" element={<h2 className="text-center my-5">Page Not Found</h2>} />
      </Routes>
    </>
  )
}

export default App;
