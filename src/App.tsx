import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import AtsChecker from './pages/AtsChecker'
import CompanyTailor from './pages/CompanyTailor'
import Templates from './pages/Templates'
import Pricing from './pages/Pricing'
import BYOKManager from './pages/BYOKManager'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import BYOKSecurity from './pages/BYOKSecurity'
import Cookies from './pages/Cookies'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
        <Route path="/ats-checker" element={<AtsChecker />} />
        <Route path="/company-tailor" element={<CompanyTailor />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/keys" element={<BYOKManager />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/byok-security" element={<BYOKSecurity />} />
        <Route path="/cookies" element={<Cookies />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
