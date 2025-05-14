import React from 'react';
import { 
  FaHome, 
  FaUsers, 
  FaUserShield, 
  FaInfoCircle, 
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminSidebar = ({ user, onLogout, activeSection, setActiveSection }) => {
  // Sidebar navigation items
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FaHome size={18} />,
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <FaUsers size={18} />,
    },
    {
      id: 'role-management',
      label: 'Role Management',
      icon: <FaUserShield size={18} />,
    },
    {
      id: 'about-us',
      label: 'About Us',
      icon: <FaInfoCircle size={18} />,
    },
  ];

  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen flex flex-col shadow-lg transition-all duration-300">
      <div className="p-4 border-b border-blue-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`w-full flex items-center p-3 rounded-md transition-colors duration-200 ${
                  activeSection === item.id 
                    ? 'bg-blue-900 text-white' 
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-800 font-bold mr-3">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium">{user?.username || 'User'}</p>
            <p className="text-xs text-blue-300">{user?.role || 'Master Admin'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;