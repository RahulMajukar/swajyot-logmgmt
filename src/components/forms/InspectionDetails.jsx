import React from 'react';

const InspectionDetails = ({ 
  formData, 
  handleChange, 
  permissions,
  shiftOptions,
  variantOptions,
  lineOptions
}) => {
  return (
    <div className="border-x border-b border-gray-800">
      <div className="grid grid-cols-3 text-sm">
        <div className="border-r border-gray-800">
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Date: </span>
            {formData.status === 'APPROVED' ? (
              <span>{formData.inspectionDate}</span>
            ) : (
              <input
                type="date"
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleChange}
                disabled={!permissions.canEditInspectionDetails}
                className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
              />
            )}
          </div>
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Product: </span>
            {formData.status === 'APPROVED' ? (
              <span>{formData.product}</span>
            ) : (
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                disabled={!permissions.canEditInspectionDetails}
                className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
              />
            )}
          </div>
          <div className="p-2">
            <span className="font-semibold">Size No.: </span>
            {formData.status === 'APPROVED' ? (
              <span>{formData.sizeNo}</span>
            ) : (
              <input
                type="text"
                name="sizeNo"
                value={formData.sizeNo}
                onChange={handleChange}
                disabled={!permissions.canEditInspectionDetails}
                className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
              />
            )}
          </div>
        </div>
        <div className="border-r border-gray-800">
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Shift: </span>
            {formData.status === 'APPROVED' || !permissions.canEditInspectionDetails ? (
              <span>{formData.shift}</span>
            ) : (
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="px-2 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {shiftOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Variant: </span>
            {formData.status === 'APPROVED' || !permissions.canEditInspectionDetails ? (
              <span>{formData.variant}</span>
            ) : (
              <select
                name="variant"
                value={formData.variant}
                onChange={handleChange}
                className="px-2 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {variantOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
          <div className="p-2"></div>
        </div>
        <div>
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Line No.: </span>
            {formData.status === 'APPROVED' || !permissions.canEditInspectionDetails ? (
              <span>{formData.lineNo}</span>
            ) : (
              <select
                name="lineNo"
                value={formData.lineNo}
                onChange={handleChange}
                className="px-2 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                {lineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
          <div className="border-b border-gray-800 p-2">
            <span className="font-semibold">Customer: </span>
            {formData.status === 'APPROVED' || !permissions.canEditInspectionDetails ? (
              <span>{formData.customer}</span>
            ) : (
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            )}
          </div>
          <div className="p-2">
            <span className="font-semibold">Sample Size: </span>
            {formData.status === 'APPROVED' || !permissions.canEditInspectionDetails ? (
              <span>{formData.sampleSize}</span>
            ) : (
              <input
                type="text"
                name="sampleSize"
                value={formData.sampleSize}
                onChange={handleChange}
                className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;