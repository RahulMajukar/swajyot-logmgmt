import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Change if needed
const API_ENDPOINT = `${API_BASE_URL}/api/coating-inspection-reports`;

// Handle API errors cleanly
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    throw new Error('No response from server');
  } else {
    throw new Error(error.message);
  }
};

// API methods
const getAllReports = async () => {
  try {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getReportById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createReport = async (reportData) => {
  try {
    const response = await axios.post(API_ENDPOINT, reportData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateReport = async (id, reportData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/${id}`, reportData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const submitReport = async (id, submittedBy) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/${id}/submit`, null, {
      params: { submittedBy }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const approveReport = async (id, reviewedBy, comments = '') => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/${id}/approve`, null, {
      params: { reviewedBy, comments }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const rejectReport = async (id, reviewedBy, comments) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/${id}/reject`, null, {
      params: { reviewedBy, comments }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteReport = async (id) => {
  try {
    await axios.delete(`${API_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    return handleError(error);
  }
};

const downloadPdf = async (id, userName) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}/pdf`, {
      params: { userName },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `coating_inspection_report_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    return handleError(error);
  }
};

// Exporting all functions
export const coatingInspectionAPI = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  submitReport,
  approveReport,
  rejectReport,
  deleteReport,
  downloadPdf
};

export default coatingInspectionAPI;