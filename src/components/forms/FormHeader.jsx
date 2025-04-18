import React from 'react';

const FormHeader = ({ 
  formData, 
  handleChange, 
  permissions 
}) => {
  return (
    <div className="border border-gray-800">
      <div className="grid grid-cols-3">
        {/* Left column - Document info */}
        <div className="border-r border-gray-800">
          <table className="text-sm p-6 pt-4">
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Document No. :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="documentNo"
                    value={formData.documentNo}
                    onChange={handleChange}
                    disabled={true}
                    className="w-full px-1 py-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Issuance No. :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="issuanceNo"
                    value={formData.issuanceNo}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Date of Issue :</td>
                <td className="p-1">
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-1 font-semibold border-r border-gray-800">Reviewed by :</td>
                <td className="p-1">
                  <input
                    type="date"
                    name="reviewedDate"
                    value={formData.reviewedDate}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
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
                    value={formData.page}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
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
                    value={formData.preparedBy}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
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
                    value={formData.approvedBy}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
                    className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-1 font-semibold border-r border-gray-800">Issued :</td>
                <td className="p-1">
                  <input
                    type="text"
                    name="issued"
                    value={formData.issued}
                    onChange={handleChange}
                    disabled={!permissions.canEditDocumentInfo}
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
            <h1 className="text-xl font-bold">AGI Greenpac Limited</h1>
            <p className="text-sm mt-1">Unit :- AGI Speciality Glas Division</p>
            <div className="mt-8">
              <p className="text-sm">
                <span className="font-bold">SCOPE : </span>
                <span className="uppercase">{formData.scope || "AGI / DEC / COATING"}</span>
              </p>
              <p className="text-sm mt-4">
                <span className="font-bold">TITLE : </span>
                <span className="uppercase">{formData.title || "FIRST ARTICLE INSPECTION REPORT - COATING"}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Logo */}
        <div className="flex justify-center m-9">
          <img
            src="https://camo.githubusercontent.com/23528efa2ac40a4438536df8a46ff30e8d90f42a342b6bf6dbb6decb55ab8e86/68747470733a2f2f656e637279707465642d74626e302e677374617469632e636f6d2f696d616765733f713d74626e3a414e64394763517336636a7049706377394a4c4d4b6b796d3366506a746d563163506b533535784e66512673"
            alt="AGI Logo"
            className="w-18 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default FormHeader;