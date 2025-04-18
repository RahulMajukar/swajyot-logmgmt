import React from 'react'

function FormFooter({ 
  formData, 
  handleChange, 
  permissions, 
  QASign, 
  OperatorSign 
}) {
  return (
    <div className="border-x border-b border-gray-800">
      <div className="flex justify-between items-center p-4">
        {/* QA Signature Display */}
        <div className="flex items-center">
          <div className="font-semibold mr-2">QA Exe.</div>
          <div className="w-16">
            {formData?.qaSignature ? (
              <div className="h-12 flex items-center">
                {/* Attempt to load the image */}
                <img
                  src={QASign}
                  alt="QA Signature"
                  onError={(e) => {
                    console.error('Failed to load QA signature image');
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback if image fails to load */}
                <div
                  className="h-12 border border-dashed border-gray-400 hidden items-center justify-center w-full"
                  title={`Signed by: ${formData.qaExecutive}`}
                >
                  <span className="text-xs text-gray-500">Signed digitally</span>
                </div>
              </div>
            ) : (
              <div className="h-12 border border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-500">No signature</span>
              </div>
            )}
          </div>
        </div>

        {/* Operator Signature Display */}
        <div className="flex items-center">
          <div className="font-semibold mr-2">Production Sup. / Operator:</div>
          <div className="w-16">
            {formData?.operatorSignature ? (
              <div className="h-12 flex items-center">
                {/* Attempt to load the image */}
                <img
                  src={OperatorSign}
                  alt="Operator Signature"
                  onError={(e) => {
                    console.error('Failed to load Operator signature image');
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback if image fails to load */}
                <div
                  className="h-12 border border-dashed border-gray-400 hidden items-center justify-center w-full"
                  title={`Signed by: ${formData.productionOperator}`}
                >
                  <span className="text-xs text-gray-500">Signed digitally</span>
                </div>
              </div>
            ) : (
              <div className="h-12 border border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-500">No signature</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 border-t border-gray-800 p-4">
        <span className="font-semibold">Time (Final Approval) : </span>
        <input
          type="text"
          name="finalApprovalTime"
          value={formData?.finalApprovalTime || ''}
          onChange={handleChange}
          disabled={!(permissions?.canApprove || permissions?.canEditDocumentInfo)}
          className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
        />
      </div>
    </div>
  )
}

export default FormFooter