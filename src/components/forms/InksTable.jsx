import React from 'react';

// This is a specialized version of the LacquersTable for printing forms
const InksTable = ({ 
  formData, 
  handleInkChange, 
  permissions,
  setFormData
}) => {
  return (
    <div className="relative">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-800 p-2 w-12 bg-gray-200">S.No.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Ink / Dye</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Batch No.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {formData.inks.map((ink, index) => (
            <tr key={ink.id}>
              <td className="border border-gray-800 p-2 text-center">{ink.id}</td>
              <td className="border border-gray-800 p-2">
                {formData.status === 'APPROVED' || !permissions.canEditInks ? (
                  <div className="px-1 py-1">{ink.name}</div>
                ) : (
                  <select
                    value={ink.name}
                    onChange={(e) => handleInkChange(index, 'name', e.target.value)}
                    className="w-full px-1 py-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select Ink/Dye</option>
                    <option value="Black Ink">Black Ink</option>
                    <option value="Blue Ink">Blue Ink</option>
                    <option value="Red Ink">Red Ink</option>
                    <option value="White Ink">White Ink</option>
                    <option value="Yellow Ink">Yellow Ink</option>
                    <option value="Green Ink">Green Ink</option>
                  </select>
                )}
              </td>
              <td className="border border-gray-800 p-2 text-center">
                {formData.status === 'APPROVED' ? (
                  <div>{ink.batchNo}</div>
                ) : (
                  <input
                    type="text"
                    value={ink.batchNo}
                    onChange={(e) => handleInkChange(index, 'batchNo', e.target.value)}
                    disabled={!permissions.canEditInks}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                )}
              </td>
              <td className="border border-gray-800 p-2 text-center">
                {formData.status === 'APPROVED' ? (
                  <div>{ink.expiryDate}</div>
                ) : (
                  <input
                    type="date"
                    value={ink.expiryDate}
                    onChange={(e) => handleInkChange(index, 'expiryDate', e.target.value)}
                    disabled={!permissions.canEditInks}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Row button */}
      {formData.status !== 'APPROVED' && permissions.canEditInks && (
        <button
          type="button"
          onClick={() => {
            const newId = formData.inks.length > 0
              ? Math.max(...formData.inks.map(l => l.id)) + 1
              : 1;

            const updatedInks = [
              ...formData.inks,
              { id: newId, name: '', batchNo: '', expiryDate: '' }
            ];

            setFormData({
              ...formData,
              inks: updatedInks
            });
          }}
          className="mt-2 flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Row
        </button>
      )}
    </div>
  );
};

export default InksTable;