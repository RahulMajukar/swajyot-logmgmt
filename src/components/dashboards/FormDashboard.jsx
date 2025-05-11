import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, LogOut } from 'lucide-react';

// Static form data
const formData = [
  {
    id: 1,
    title: 'Quality Inspection Report',
    description: 'Create and manage incoming quality inspection reports',
    icon: '📋',
    formType: 'quality',
    category: 'Quality',
    roles: ['operator', 'qa', 'avp', 'master']
  },
  {
    id: 2,
    title: 'First Article Inspection Report - Fair coating',
    description: 'Quality assessment for coating applications and standards',
    icon: '🎨',
    formType: 'coating',
    category: 'Quality',
    roles: ['operator', 'qa', 'avp', 'master']
  },
  {
    id: 3,
    title: 'Line Clearance Report',
    description: 'Manage and submit production line clearance documentation',
    icon: '✓',
    formType: 'clearance',
    category: 'Production',
    roles: ['operator', 'qa', 'avp', 'master']
  },
  {
    id: 4,
    title: 'Printing Inspection',
    description: 'Document printing quality inspections and standards',
    icon: '🖨️',
    formType: 'printing',
    category: 'Quality',
    roles: ['operator', 'qa', 'avp', 'master']
  },
  // {
  //   id: 5,
  //   title: 'Maintenance Request',
  //   description: 'Submit and track equipment maintenance requests',
  //   icon: '🔧',
  //   formType: 'maintenance',
  //   category: 'Equipment',
  //   roles: ['operator', 'master']
  // },
  // {
  //   id: 6,
  //   title: 'Inventory Report',
  //   description: 'Track and manage inventory levels and movements',
  //   icon: '📦',
  //   formType: 'inventory',
  //   category: 'Logistics',
  //   roles: ['operator', 'master']
  // },
  // {
  //   id: 7,
  //   title: 'Safety Incident',
  //   description: 'Report and document workplace safety incidents',
  //   icon: '⚠️',
  //   formType: 'safety',
  //   category: 'Safety',
  //   roles: ['operator', 'qa', 'avp', 'master']
  // },
  // {
  //   id: 8,
  //   title: 'Employee Training',
  //   description: 'Record completed employee training sessions',
  //   icon: '🎓',
  //   formType: 'training',
  //   category: 'HR',
  //   roles: ['avp', 'master']
  // }
];

// Form card using <Link>
const FormCard = ({ form }) => {
  return (
    <Link
      to={`/forms/${form.formType}`}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 border border-transparent hover:border-blue-100 block"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{form.icon}</span>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {form.category}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{form.title}</h3>
      <p className="text-gray-600">{form.description}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <span className="text-blue-600 font-medium text-sm flex items-center">
          View Forms
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

// Main dashboard component
const FormDashboard = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForms, setFilteredForms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const userAccessibleForms = useMemo(() => {
    return formData.filter(form =>
      form.roles.includes(user.role.toLowerCase())
    );
  }, [user.role]);

  useEffect(() => {
    setFilteredForms(userAccessibleForms);
    const uniqueCategories = [...new Set(userAccessibleForms.map(form => form.category))];
    setCategories(uniqueCategories);
  }, [userAccessibleForms]);

  useEffect(() => {
    let result = userAccessibleForms;

    if (searchQuery) {
      result = result.filter(form =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(form => form.category === selectedCategory);
    }

    setFilteredForms(result);
  }, [searchQuery, selectedCategory, userAccessibleForms]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const getDashboardUrl = () => {
    const role = user.role.toLowerCase();
    if (role === 'operator') return '/operator';
    if (role === 'qa') return '/qa';
    if (role === 'avp') return '/avp';
    if (role === 'master') return '/master';
    return '/';
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'}`}
              onClick={() => handleCategorySelect('All')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-700">
            {filteredForms.length === 0
              ? 'No forms found'
              : `Showing ${filteredForms.length} ${filteredForms.length === 1 ? 'form' : 'forms'}`}
          </h2>
          {selectedCategory !== 'All' && (
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setSelectedCategory('All')}
            >
              Clear filter
            </button>
          )}
        </div>

        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredForms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormDashboard;