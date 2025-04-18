import React from 'react';

const FormStatusBanner = ({ status, submittedBy }) => {
  if (status === 'DRAFT') return null;
  
  const getBgColor = () => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-600';
      case 'APPROVED': return 'bg-green-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <div className={`px-4 py-2 text-white font-semibold ${getBgColor()}`}>
      Form Status: {status}
      {submittedBy && ` - Submitted by ${submittedBy}`}
    </div>
  );
};

export default FormStatusBanner;