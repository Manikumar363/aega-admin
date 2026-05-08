import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EnquiriesPage from './pages/EnquiriesPage';
import EnquiryViewPage from './pages/EnquiryViewPage';
import CompliancesPage from './pages/CompliancesPage';
import ComplianceViewPage from './pages/ComplianceViewPage';
import CDPTraining from './pages/CDPTraining';
import AddCDPTraining from './pages/AddCDPTraining';
import CompanyManagementHome from './pages/companyManagement/Home';
import AddCompany from './pages/companyManagement/AddCompany';
import AgentManagementHome from './pages/agentManagement/Home';
import UniManagementHome from './pages/universityManagement/Home';
import StudentManagementHome from './pages/studentManagement/Home';
import RevenueManagementHome from './pages/revenueManagement/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries"
            element={
              <ProtectedRoute>
                <EnquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries/:id"
            element={
              <ProtectedRoute>
                <EnquiryViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliances"
            element={
              <ProtectedRoute>
                <CompliancesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliances/view/:id"
            element={
              <ProtectedRoute>
                <ComplianceViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/office"
            element={
              <ProtectedRoute>
                <CompanyManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/office/add"
            element={
              <ProtectedRoute>
                <AddCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/universities"
            element={
              <ProtectedRoute>
                <UniManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AgentManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenue"
            element={
              <ProtectedRoute>
                <RevenueManagementHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdp"
            element={
              <ProtectedRoute>
                <CDPTraining />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdp/add"
            element={
              <ProtectedRoute>
                <AddCDPTraining />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
