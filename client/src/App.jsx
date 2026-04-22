import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ServicesAdmin from './pages/admin/ServicesAdmin.jsx';
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx';
import ContactsAdmin from './pages/admin/ContactsAdmin.jsx';
import ForgotPassword from './pages/admin/ForgotPassword.jsx';
import ResetPassword from './pages/admin/ResetPassword.jsx';
import ChangePassword from './pages/admin/ChangePassword.jsx';
import RequireAuth from './components/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="contacts" element={<ContactsAdmin />} />
        <Route path="account" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}
