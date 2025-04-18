import React from 'react'

function ActionButtons({ 
  navigate,
  permissions,
  saving,
  saveDraft,
  submitForm,
  qaSubmitForm,
  qaRejectForm,
  approveForm,
  rejectForm,
  downloadPdf,
  setIsEmailModalOpen,
  formId
}) {
  return (
    <div className="p-4 bg-gray-100 flex justify-between">
      <button
        type="button"
        onClick={() => navigate('/forms')}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Back to Forms
      </button>

      <div className="space-x-2">
        {/* Operator buttons */}
        {permissions?.canSaveDraft && (
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
        )}

        {permissions?.canSubmit && (
          <button
            type="button"
            onClick={submitForm}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            {saving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        )}

        {/* QA buttons */}
        {permissions?.canQAReject && (
          <button
            type="button"
            onClick={qaRejectForm}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
          >
            {saving ? 'Rejecting...' : 'Reject Form'}
          </button>
        )}

        {permissions?.canQASubmit && (
          <button
            type="button"
            onClick={qaSubmitForm}
            disabled={saving}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-indigo-300"
          >
            {saving ? 'Submitting...' : 'Submit to AVP'}
          </button>
        )}

        {/* AVP buttons */}
        {permissions?.canReject && (
          <button
            type="button"
            onClick={rejectForm}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
          >
            {saving ? 'Rejecting...' : 'Reject Form'}
          </button>
        )}

        {permissions?.canApprove && (
          <button
            type="button"
            onClick={approveForm}
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-300"
          >
            {saving ? 'Approving...' : 'Approve Form'}
          </button>
        )}

        {/* Download PDF button - visible to master and when approved */}
        {permissions?.canDownloadPdf && (
          <button
            type="button"
            onClick={downloadPdf}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Download PDF
          </button>
        )}
        {permissions?.canDownloadPdf && (
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Send Email
          </button>
        )}
      </div>
    </div>
  )
}

export default ActionButtons