import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inspectionFormAPI } from '../services/api';
// import { DashboardLayout } from '../SharedComponents';
import FormDashboard from './FormDashboard';
import AdminSidebar from './admin/AdminSidebar';
import UserManagement from './admin/UserManagement';
import RoleManagement from './admin/RoleManagement';
import FormsAnalytics from './admin/FormsAnalytics';
import AboutUs from './admin/AboutUs';
import { FaBars } from 'react-icons/fa';
import logo from '../../assets/Qsutra RMS Square Blue.png';

const MasterDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [pendingForms, setPendingForms] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    approvedToday: 0,
    avgApprovalTime: 0,
    qualityIssues: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch forms pending approval
      const submittedForms = await inspectionFormAPI.getFormsByStatus('SUBMITTED');
      setPendingForms(submittedForms);

      // Fetch recent form activity
      const allForms = await inspectionFormAPI.getAllForms();

      // Sort forms by most recently updated
      const sortedForms = [...allForms].sort((a, b) => {
        const dateA = a.reviewedAt || a.submittedAt || new Date(0);
        const dateB = b.reviewedAt || b.submittedAt || new Date(0);
        return new Date(dateB) - new Date(dateA);
      });

      setRecentActivity(sortedForms.slice(0, 5)); // Get only the 5 most recent

      // Calculate metrics
      calculateMetrics(allForms);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard metrics
  const calculateMetrics = (forms) => {
    try {
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Forms approved today
      const approvedToday = forms.filter(form => {
        if (!form.reviewedAt || form.status !== 'APPROVED') return false;
        const reviewDate = new Date(form.reviewedAt);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === today.getTime();
      }).length;

      // Calculate average approval time (in hours)
      const approvedForms = forms.filter(form =>
        form.status === 'APPROVED' && form.submittedAt && form.reviewedAt
      );

      let totalApprovalTime = 0;

      approvedForms.forEach(form => {
        const submittedTime = new Date(form.submittedAt).getTime();
        const reviewedTime = new Date(form.reviewedAt).getTime();
        const diffHours = (reviewedTime - submittedTime) / (1000 * 60 * 60);
        totalApprovalTime += diffHours;
      });

      const avgTime = approvedForms.length > 0
        ? (totalApprovalTime / approvedForms.length).toFixed(1)
        : 0;

      // Count quality issues (rejected forms)
      const qualityIssues = forms.filter(form => form.status === 'REJECTED').length;

      // Calculate compliance rate
      const decidedForms = forms.filter(form =>
        form.status === 'APPROVED' || form.status === 'REJECTED'
      );

      const complianceRate = decidedForms.length > 0
        ? ((decidedForms.length - qualityIssues) / decidedForms.length * 100).toFixed(1)
        : 100;

      setMetrics({
        approvedToday,
        avgApprovalTime: avgTime,
        qualityIssues,
        complianceRate
      });

    } catch (error) {
      console.error('Error calculating metrics:', error);
      // Set default values if calculation fails
      setMetrics({
        approvedToday: 0,
        avgApprovalTime: 0,
        qualityIssues: 0,
        complianceRate: 0
      });
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <FormDashboard user={user} onLogout={onLogout} />;
      // case 'forms-analytics':
        // return <FormsAnalytics />;
      case 'user-management':
        return <UserManagement />;
      case 'role-management':
        return <RoleManagement />;
      case 'about-us':
        return <AboutUs />;
      default:
        return <FormDashboard user={user} onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {sidebarVisible && (
        <AdminSidebar
          user={user}
          onLogout={onLogout}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
      <div className="flex-1">
        <div className="bg-gradient-to-b from-purple-600 via-violet-500 to-purple-400 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-blue-700 mr-2"
              aria-label={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              <FaBars size={20} />
            </button>
            {/* Logo image before the Dashboard title */}
            <img
              src="http://localhost:5173/src/assets/QSUTRALogo.png"
              alt="Dashboard Logo"
              className="h-8 mr-3"
            />
            <h1 className="text-xl font-bold">
              Master Dashboard: {activeSection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
          </div>
          <div>
            <span className="text-sm mr-4">Logged in as: {user?.username || 'User'}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <DashboardLayout
          user={user}
          onLogout={onLogout}
          title="Master Dashboard"
          subtitle="Manage production inspections and reports"
        >
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading dashboard data...</p>
              </div>
            ) : (
              renderContent()
            )}
          </div>

        </DashboardLayout>

      </div>
    </div>
  );
};

export default MasterDashboard;


// Dashboard Layout wrapper that includes shared elements
export const DashboardLayout = ({ user, onLogout, title, subtitle, children }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* <TopNavBar user={user} onLogout={onLogout} /> */}

            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full text-center">
                    <h1 className="text-4xl font-semibold text-gray-900">{title}</h1>
                    <p className="mt-2 text-gray-600">{subtitle}</p>

                    <div className="mt-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};