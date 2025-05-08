import React, { useState } from 'react';
import { coatingInspectionAPI } from './coatingInspectionAPI';

const CoatingEmailModal = ({ isOpen, onClose, formId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Coating Inspection Report PDF',
    body: 'Please find attached the coating inspection report PDF.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formId) {
      alert('Form ID is missing');
      return;
    }

    try {
      setLoading(true);
      console.log("Sending email for coating inspection report:", formId);
      console.log("Email data:", emailData);
      
      // Get user info from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const userName = user?.name || 'Anonymous';

      // Send email with the PDF
      const response = await coatingInspectionAPI.sendEmailWithPdf(formId, emailData, userName);

      console.log("Email API response:", response);
      alert('Email sent successfully!');
      onClose();

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.response?.data?.error || error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Send Coating Inspection Report PDF</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email*
            </label>
            <input
              type="email"
              id="to"
              name="to"
              value={emailData.to}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="recipient@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="body"
              name="body"
              value={emailData.body}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoatingEmailModal;