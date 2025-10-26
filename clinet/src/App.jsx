import './App.css'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SendResetMail from './components/SendResetMail'
import StartInterview from './components/StartInterview'
import StudentDashboard from './components/student/StudentDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RegistrationForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/sendresetmail' element={<SendResetMail />} />
        <Route path='/forgot-password' element={<ForgotPasswordForm />} />
        <Route path='/dashboard' element={<Dashboard />} /> 
        <Route path='/student-dashboard' element={<StudentDashboard />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/start-interview' element={<StartInterview />} />
      </Routes>
    </>
  )
}

export default App