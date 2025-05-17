import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for users - would be replaced with API data in a real app
  const [users] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'Master Admin',
      status: 'active'
    },
    {
      id: 2,
      username: 'operator1',
      email: 'operator1@example.com',
      role: 'Operator',
      status: 'active'
    },
    {
      id: 3,
      username: 'manager1',
      email: 'manager1@example.com',
      role: 'Manager',
      status: 'inactive'
    }
  ]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      
      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch />
          </div>
        </div>
        
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200">
          <FaPlus className="mr-2" />
          Add New User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Username</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="border p-3">{user.username}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.role}</td>
                <td className="border p-3">
                  {user.status === 'active' ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center w-fit">
                      <FaCheck className="mr-1" size={10} />
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center w-fit">
                      <FaTimes className="mr-1" size={10} />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="border p-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit User">
                      <FaEdit />
                    </button>
                    {user.status === 'active' ? (
                      <button className="text-red-600 hover:text-red-800 p-1" title="Deactivate User">
                        <FaTimes />
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-800 p-1" title="Activate User">
                        <FaCheck />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-800 p-1" title="Delete User">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="border p-4 text-center text-gray-500">
                  No users found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;