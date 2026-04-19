import { Routes, Route } from 'react-router-dom'
import Intro from './pages/Intro'
import About from './pages/About'
import Dashboard from './pages/Dashboard/Dashboard'
import Task from './pages/Dashboard/Task'
import Friends from './pages/Dashboard/Friends'
import Rewards from './pages/Dashboard/Rewards'
import ParentDashboard from './pages/ParentDashboard'
import Login from './pages/Authentication/Login'
import Signup from './pages/Authentication/Signup'
import ChildSignup from './pages/Authentication/ChildSignup'
import ChildTasks from './pages/Dashboard/ChildTasks'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import VerificationSuccess from './pages/VerificationSuccess'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/child-signup" element={<ChildSignup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/task" element={<Task />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/child-dashboard" element={<ChildTasks />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/verification" element={<VerificationSuccess />} />
      <Route path="/Celebration" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
