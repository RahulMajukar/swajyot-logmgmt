import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inspectionFormAPI } from './api';
import { DashboardLayout, formatDate } from './SharedComponents';
import { PlusCircle, List, ChevronDown } from 'lucide-react';

const OperatorDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentForms, setRecentForms] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Create New Form');

  // Fetch recent forms on component mount
  useEffect(() => {
    const fetchRecentForms = async () => {
      try {
        const forms = await inspectionFormAPI.getFormsBySubmitter(user.name);
        setRecentForms(forms.slice(0, 5)); // Get the 5 most recent forms
      } catch (error) {
        console.error("Error fetching recent forms:", error);
      }
    };

    fetchRecentForms();
  }, [user.name]);

  // Navigate to view all forms
  const handleViewAllForms = () => {
    navigate('/forms');
  };

  // Navigate to create a new form
  const handleCreateNewForm = (formType) => {
    if (formType === 'FAIR Printing') {
      navigate('/printing-inspection-form');
    } else {
      // Default to coating form
      navigate('/inspection-form');
    }
  };

  // Navigate to view a specific form
  const handleViewForm = (formId, formType) => {
    if (formType === 'printing') {
      navigate(`/printing-inspection-form/${formId}`);
    } else {
      navigate(`/inspection-form/${formId}`);
    }
  };

  const formTypes = [
    { id: 'coating', name: 'FAIR Coating' },
    { id: 'printing', name: 'FAIR Printing' },
    // Additional form types can be added here
    // { id: 'lamination', name: 'Lamination' },
    // { id: 'cutting', name: 'Die Cutting' }
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      title="Operator Dashboard"
      subtitle="Manage production inspections and reports"
    >

      {/* Form Status Overview */}
      <div className="bg-white shadow sm:rounded-lg mb-4">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Form Status Overview</h3>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500 truncate">Draft Forms</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {recentForms.filter(form => form.status === 'DRAFT').length}
              </dd>
            </div>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500 truncate">Submitted Forms</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {recentForms.filter(form => form.status === 'SUBMITTED').length}
              </dd>
            </div>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500 truncate">Approved Forms</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {recentForms.filter(form => form.status === 'APPROVED').length}
              </dd>
            </div>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-4">
              <dt className="text-sm font-medium text-gray-500 truncate">Rejected Forms</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {recentForms.filter(form => form.status === 'REJECTED').length}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="mb-6 bg-white shadow-lg overflow-hidden rounded-lg border border-gray-100">
        <div className="px-6 py-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-full mr-3">
              <PlusCircle className="h-5 w-5 text-indigo-600" />
            </span>
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                <span className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {selectedAction}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 max-h-60 overflow-auto">
                    {formTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          handleCreateNewForm(type.name);
                          setSelectedAction(type.name);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-150 flex items-center"
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* View All Button */}
            <button
              onClick={handleViewAllForms}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              <List className="h-4 w-4 mr-2 text-gray-500" />
              View All Inspection Forms
            </button>
          </div>
          
          {/* Recently Used Forms Section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Recently Used Forms</h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recentForms.slice(0, 2).map((form) => (
                <button
                  key={form.id}
                  onClick={() => handleViewForm(form.id, form.formType || 'coating')}
                  className="text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition duration-150 flex items-center"
                >
                  {form.variant} - {formatDate(form.inspectionDate)}
                  {form.formType === 'printing' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Printing</span>}
                </button>
              ))}
              {recentForms.length === 0 && (
                <div className="text-sm text-gray-500 px-3 py-2">
                  No recent forms available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inspection Forms - Now Full Width */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Inspection Forms</h3>
            <button
              onClick={handleViewAllForms}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="mt-4">
            {recentForms.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No recent inspection forms
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentForms.map(form => (
                  <li key={form.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{form.documentNo || 'No Document #'}</p>
                        {form.formType === 'printing' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Printing</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {form.variant} - {form.formType === 'printing' ? `MC ${form.mcNo}` : `Line ${form.lineNo}`} - {formatDate(form.inspectionDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: <span className={`font-medium ${form.status === 'APPROVED' ? 'text-green-600' :
                          form.status === 'REJECTED' ? 'text-red-600' :
                            form.status === 'SUBMITTED' ? 'text-blue-600' : 'text-gray-600'
                          }`}>{form.status}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewForm(form.id, form.formType || 'coating')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default OperatorDashboard;