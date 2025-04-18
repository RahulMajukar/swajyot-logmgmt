import React from 'react';

const LacquersTable = ({ 
  formData, 
  handleLacquerChange, 
  permissions,
  setFormData
}) => {
  return (
    <div className="relative">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-800 p-2 w-12 bg-gray-200">S.No.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Lacquer / Dye</th>
            <th className="border border-gray-800 p-2 bg-gray-200">wt.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Batch No.</th>
            <th className="border border-gray-800 p-2 bg-gray-200">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {formData.lacquers.map((lacquer, index) => {
            // Define unit based on the selected lacquer/dye
            let unit = "GM";
            if (lacquer.name === "Clear Extn") {
              unit = "KG";
            }

            return (
              <tr key={lacquer.id}>
                <td className="border border-gray-800 p-2 text-center">{lacquer.id}</td>
                <td className="border border-gray-800 p-2">
                  {formData.status === 'APPROVED' || !permissions.canEditLacquers ? (
                    <div className="px-1 py-1">{lacquer.name}</div>
                  ) : (
                    <select
                      value={lacquer.name}
                      onChange={(e) => handleLacquerChange(index, 'name', e.target.value)}
                      className="w-full px-1 py-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select Lacquer/Dye</option>
                      <option value="Clear Extn">Clear Extn</option>
                      <option value="Red Dye">Red Dye</option>
                      <option value="Black Dye">Black Dye</option>
                      <option value="Pink Dye">Pink Dye</option>
                      <option value="Violet Dye">Violet Dye</option>
                      <option value="Matt Bath">Matt Bath</option>
                      <option value="Hardener">Hardener</option>
                    </select>
                  )}
                </td>
                <td className="border border-gray-800 p-2 text-center">
                  <div className="flex items-center">
                    {formData.status === 'APPROVED' ? (
                      <div>
                        {lacquer.weight} {lacquer.name && unit}
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={lacquer.weight}
                          onChange={(e) => handleLacquerChange(index, 'weight', e.target.value)}
                          disabled={!permissions.canEditLacquers}
                          className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                        {lacquer.name && (
                          <span className="ml-1 text-gray-500 text-xs whitespace-nowrap">{unit}</span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="border border-gray-800 p-2 text-center">
                  {formData.status === 'APPROVED' ? (
                    <div>{lacquer.batchNo}</div>
                  ) : (
                    <input
                      type="text"
                      value={lacquer.batchNo}
                      onChange={(e) => handleLacquerChange(index, 'batchNo', e.target.value)}
                      disabled={!permissions.canEditLacquers}
                      className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  )}
                </td>
                <td className="border border-gray-800 p-2 text-center">
                  {formData.status === 'APPROVED' ? (
                    <div>{lacquer.expiryDate}</div>
                  ) : (
                    <input
                      type="date"
                      value={lacquer.expiryDate}
                      onChange={(e) => handleLacquerChange(index, 'expiryDate', e.target.value)}
                      disabled={!permissions.canEditLacquers}
                      className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Row button */}
      {formData.status !== 'APPROVED' && permissions.canEditLacquers && (
        <button
          type="button"
          onClick={() => {
            const newId = formData.lacquers.length > 0
              ? Math.max(...formData.lacquers.map(l => l.id)) + 1
              : 1;

            const updatedLacquers = [
              ...formData.lacquers,
              { id: newId, name: '', weight: '', batchNo: '', expiryDate: '' }
            ];

            setFormData({
              ...formData,
              lacquers: updatedLacquers
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

export default LacquersTable;
