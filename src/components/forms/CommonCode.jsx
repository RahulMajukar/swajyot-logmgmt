import React from 'react';

export const FormHeader = ({ 
  documentInfo,
  title = "AGI Greenpac Limited",
  scope = "",
  unit = "",
  logo = "https://camo.githubusercontent.com/23528efa2ac40a4438536df8a46ff30e8d90f42a342b6bf6dbb6decb55ab8e86/68747470733a2f2f656e637279707465642d74626e302e677374617469632e636f6d2f696d616765733f713d74626e3a414e64394763517336636a7049706377394a4c4d4b6b796d3366506a746d563163506b533535784e66512673",
  onDocumentInfoChange,
  readOnly = false
}) => {
  const handleChange = (e) => {
    if (onDocumentInfoChange && !readOnly) {
      const { name, value } = e.target;
      onDocumentInfoChange(name, value);
    }
  };

  return (
    <div className="border border-gray-800">
      <div className="grid grid-cols-3">
        {/* Left column - Document info */}
        <div className="border-r border-gray-800">
          <table className="text-sm w-full">
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Document No. :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="documentNo"
                    value={documentInfo.documentNo || ''}
                    onChange={handleChange}
                    disabled
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder='Auto generated'
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Revision :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="revision"
                    value={documentInfo.revision || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Effective Date :</td>
                <td className="p-1">
                  <input
                    type="date"
                    name="effectiveDate"
                    value={documentInfo.effectiveDate || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Reviewed on :</td>
                <td className="p-1">
                  <input
                    type="date"
                    name="reviewedOn"
                    value={documentInfo.reviewedOn || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Page :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="page"
                    value={documentInfo.page || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Prepared By :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="preparedBy"
                    value={documentInfo.preparedBy || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Approved by :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="approvedBy"
                    value={documentInfo.approvedBy || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-1 font-semibold border-r border-gray-800">Issued by :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="issuedBy"
                    value={documentInfo.issuedBy || ''}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Middle column - Title */}
        <div className="border-r border-gray-800 p-2 flex-1 content-center align-super">
          <div className="text-center">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm mt-1">Unit :- {unit}</p>
            <div className="mt-8">
              <p className="text-sm">
                <span className="font-bold">SCOPE : </span>
                <span className="uppercase">{scope}</span>
              </p>
              <p className="text-sm mt-4">
                <span className="font-bold">TITLE : </span>
                <span className="uppercase">{documentInfo.title || ''}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Logo */}
        <div className="flex justify-center items-center p-4">
          <img
            src={logo}
            alt="AGI Logo"
            className="w-32 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

// Status banner component for displaying form status
export const StatusBanner = ({ status, submittedBy }) => {
  if (status === 'DRAFT') return null;
  
  const bgColor = 
    status === 'SUBMITTED' ? 'bg-blue-600' :
    status === 'APPROVED' ? 'bg-green-600' :
    'bg-red-600';
  
  return (
    <div className={`px-4 py-2 text-white font-semibold ${bgColor}`}>
      Form Status: {status}
      {submittedBy && ` - Submitted by ${submittedBy}`}
    </div>
  );
};

// Form action buttons component
export const FormActionButtons = ({ 
  permissions, 
  onSaveDraft, 
  onSubmit, 
  onQAReject, 
  onQASubmit, 
  onReject, 
  onApprove, 
  onDownloadPdf, 
  onBack,
  saving
}) => {
  return (
    <div className="p-4 bg-gray-100 flex justify-between">
      <button
        type="button"
        onClick={onBack}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Back to Forms
      </button>

      <div className="space-x-2">
        {/* Operator buttons */}
        {permissions.canSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
        )}

        {permissions.canSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        )}

        {/* QA buttons */}
        {permissions.canQAReject && (
          <button
            type="button"
            onClick={onQAReject}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
          >
            {saving ? 'Rejecting...' : 'Reject Form'}
          </button>
        )}

        {permissions.canQASubmit && (
          <button
            type="button"
            onClick={onQASubmit}
            disabled={saving}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-indigo-300"
          >
            {saving ? 'Submitting...' : 'Submit to AVP'}
          </button>
        )}

        {/* AVP buttons */}
        {permissions.canReject && (
          <button
            type="button"
            onClick={onReject}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
          >
            {saving ? 'Rejecting...' : 'Reject Form'}
          </button>
        )}

        {permissions.canApprove && (
          <button
            type="button"
            onClick={onApprove}
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-300"
          >
            {saving ? 'Approving...' : 'Approve Form'}
          </button>
        )}

        {/* Download PDF button - visible to master and when approved */}
        {permissions.canDownloadPdf && (
          <button
            type="button"
            onClick={onDownloadPdf}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  FormHeader,
  StatusBanner,
  FormActionButtons
};