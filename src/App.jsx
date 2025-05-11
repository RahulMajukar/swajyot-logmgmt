import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import OperatorDashboard from './components/dashboards/OperatorDashboard';
import AVPDashboard from './components/dashboards/AVPDashboard';
import MasterDashboard from './components/dashboards/MasterDashboard';
import InspectionFormList from './components/InspectionFormList';
import PrintingInspectionForm from './components/forms/printing-inspection-form/PrintingInspectionForm';
import LineClearanceForm from './components/forms/line_clearance_form/LineClearanceForm';
import FormDashboard from './components/dashboards/FormDashboard'; 
import { AuthProvider, useAuth } from './components/context/AuthContext';
import QADashboard from './components/dashboards/QADashboard';
import Chatbot from './components/Chatbot';
import CoatingInspectionForm from './components/forms/fair-coating/CoatingInspectionForm';
import QualityInspectionForm from './components/forms/qulality _inspection_form/QualityInspectionForm';

// Footer component
const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0057a7', color: 'white' }} className="py-3 text-center w-full mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">
          Built By Swajyot Technologies. 2002 – 2025.
        </p>
      </div>
    </footer>
  );
};

const InspectionFormLayout = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-300 shadow mb-4">
        <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex justify-center">
              <img
                src="https://camo.githubusercontent.com/23528efa2ac40a4438536df8a46ff30e8d90f42a342b6bf6dbb6decb55ab8e86/68747470733a2f2f656e637279707465642d74626e302e677374617469632e636f6d2f696d616765733f713d74626e3a414e64394763517336636a7049706377394a4c4d4b6b796d3366506a746d563163506b533535784e66512673"
                alt="AGI Logo"
                className="w-16 h-auto"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded"
            >
              Back to Forms Dashboard
            </Link>

            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      {/* {user && <Chatbot user={user} />} */}
    </div>
  );
};

const Layout = ({ children, user }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      {/* {user && <Chatbot user={user} />} */}
    </div>
  );
};

const AuthRouter = () => {
  const { user, isAuthenticated, logout, isOperator, isQA, isAVP, isMaster, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    if (isAuthenticated) {
      // Only redirect if we're at the login page
      if (location.pathname === '/') {
        if (isOperator) navigate('/operator', { replace: true });
        else if (isQA) navigate('/qa', { replace: true });
        else if (isAVP) navigate('/avp', { replace: true });
        else if (isMaster) navigate('/master', { replace: true });
      }
    } else {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isOperator, isQA, isAVP, isMaster, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={
        <Layout>
          <LoginPage />
        </Layout>
      } />

      {/* Role-based Dashboard Routes */}
      <Route path="/operator" element={
        isOperator ? (
          <Layout user={user}>
            <OperatorDashboard user={user} onLogout={logout} />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/avp" element={
        isAVP ? (
          <Layout user={user}>
            <AVPDashboard user={user} onLogout={logout} />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/master" element={
        isMaster ? (
          <Layout user={user}>
            <MasterDashboard user={user} onLogout={logout} />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/qa" element={
        isQA ? (
          <Layout user={user}>
            <QADashboard user={user} onLogout={logout} />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
      
      {/* Form Lists */}
      <Route path="/forms/:formType" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <InspectionFormList />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />

      {/* Coating Inspection Forms */}
      <Route path="/forms/coating/new" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <CoatingInspectionForm isNew={true} />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/forms/coating/:id" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <CoatingInspectionForm />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />

      {/* Printing Forms */}
      <Route path="/forms/printing/new" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <PrintingInspectionForm isNew={true} />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/forms/printing/:id" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <PrintingInspectionForm />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />

      {/* Line Clearance Forms */}
      <Route path="/forms/clearance/new" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <LineClearanceForm isNew={true} />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/forms/clearance/:id" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <LineClearanceForm />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      
      {/* Quality Inspection Forms */}
      <Route path="/forms/quality/new" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <QualityInspectionForm isNew={true} />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/forms/quality/:id" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <QualityInspectionForm />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />

      {/* Legacy Routes (keep for backward compatibility) */}
      <Route path="/line-clearance-form" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <LineClearanceForm isNew={true} />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      <Route path="/line-clearance-form/:id" element={
        isAuthenticated ? (
          <InspectionFormLayout user={user} onLogout={logout}>
            <LineClearanceForm />
          </InspectionFormLayout>
        ) : <Navigate to="/" replace />
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Login Page
const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = (userData) => {
    login(userData);
  };

  return <LoginForm onLogin={handleLogin} />;
};

// Main app with auth context provider
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;