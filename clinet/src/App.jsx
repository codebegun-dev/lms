import './App.css'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SendResetMail from './components/SendResetMail'
import StartInterview from './components/StartInterview'
import Batch from './Batch_Module/Batch'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RegistrationForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/sendresetmail' element={<SendResetMail />} />
        <Route path='/reset-password' element={<ForgotPasswordForm />} />
        <Route path='/student-dashboard' element={<Dashboard />} /> 
        <Route path='/start-interview' element={<StartInterview />} />
        <Route path='/batch' element={<Batch/>} />
      </Routes>
    </>
  )
}

export default App
