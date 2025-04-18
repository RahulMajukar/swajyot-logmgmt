import React from 'react'

function ReviewInformation({ formData }) {
  if (!formData || formData.status === 'DRAFT') return null;
  
  return (
    <div className="border-x border-b border-gray-800 p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-700 mb-2">Review Information</h3>

      {formData.submittedBy && (
        <div className="text-sm mb-1">
          <span className="font-medium">Submitted by:</span> {formData.submittedBy}
          {formData.submittedAt && (
            <span className="ml-1 text-gray-500">
              on {new Date(formData.submittedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {formData.reviewedBy && (
        <div className="text-sm mb-1">
          <span className="font-medium">Reviewed by:</span> {formData.reviewedBy}
          {formData.reviewedAt && (
            <span className="ml-1 text-gray-500">
              on {new Date(formData.reviewedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {formData.comments && (
        <div className="mt-2">
          <span className="font-medium text-sm">Comments:</span>
          <div className="p-2 bg-white border border-gray-300 rounded mt-1 text-sm">
            {formData.comments}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewInformation