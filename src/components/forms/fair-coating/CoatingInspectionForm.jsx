import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FormHeader, StatusBanner } from '../CommonCode';
import { coatingInspectionAPI } from './coatingInspectionAPI';
import QASign from '../../../assets/QASign.png';
import OperatorSign from '../../../assets/OperatorSign.png';
import EmailModal from '../../EmailModal';

const CoatingInspectionForm = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(id && !isNew ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // State for email modal
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Define permissions based on user role and form status
  const [permissions, setPermissions] = useState({
    canEditDocumentInfo: false,
    canEditInspectionDetails: false,
    canEditCoatingDetails: false,
    canEditCharacteristics: false,
    canSubmit: false,
    canQASubmit: false,
    canQAReject: false,
    canApprove: false,
    canReject: false,
    canSaveDraft: false,
    canDownloadPdf: false,
    canEmailPdf: false
  });

  // Default characteristics
  const defaultCharacteristics = [
    { id: 1, name: 'Colour Shade', observation: '', comments: '' },
    { id: 2, name: 'Colour Height', observation: '', comments: '' },
    { id: 3, name: 'Any Visual defect', observation: '', comments: '' },
    { id: 4, name: 'MEK Test', observation: '', comments: '' },
    { id: 5, name: 'Cross Cut Test (Tape Test)', observation: '', comments: '' },
    { id: 6, name: 'Coating Thickness', bodyThickness: '', bottomThickness: '', comments: '' },
    { id: 7, name: 'Temperature', observation: '', comments: '' },
    { id: 8, name: 'Viscosity', observation: '', comments: '' },
    { id: 9, name: 'Batch Composition', observation: '', comments: '' }
  ];

  // Default coating details
  const defaultCoatingDetails = [
    { id: 1, lacquerType: 'Clear Extn', batchNo: '', quantity: '', expiryDate: '' },
    { id: 2, lacquerType: 'Red Dye', batchNo: '', quantity: '',  expiryDate: '' }
  ]

  // State for form data
  const [formData, setFormData] = useState({
    documentNo: '',
    issuanceNo: '00',
    issueDate: new Date().toISOString().split('T')[0],
    reviewedDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0],
    page: '1 of 1',
    preparedBy: 'QQM QC',
    approvedBy: 'AVP-QA & SYS',
    issued: 'AVP-QA & SYS',
    inspectionDate: new Date().toISOString().split('T')[0],
    product: '100 mL Bag Pke.',
    sizeNo: '',
    shift: 'C',
    variant: 'Pink matt',
    lineNo: '02',
    customer: '',
    sampleSize: '08 Nos.',
    coatingDetails: defaultCoatingDetails,
    characteristics: defaultCharacteristics,
    qaName: '',
    qaSignature: '',
    operatorName: '',
    operatorSignature: '',
    approvalTime: '',
    status: 'DRAFT',
    submittedBy: '',
    submittedAt: null,
    reviewedBy: '',
    reviewedAt: null,
    comments: '',
    // Specific fields mapped from characteristics for easier backend compatibility
    colorShade: '',
    colorHeight: '',
    visualDefect: '',
    mekTest: '',
    crossCutTest: '',
    coatingThicknessBody: '',
    coatingThicknessBottom: '',
    temperature: '',
    viscosity: '',
    batchComposition: ''
  });

  // Fetch form data if editing an existing form
  useEffect(() => {
    if (id && !isNew) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const data = await coatingInspectionAPI.getReportById(id);
          
          // Initialize characteristics if not present
          if (!data.characteristics || data.characteristics.length === 0) {
            data.characteristics = defaultCharacteristics;
          }
          
          // Initialize coating details if not present
          if (!data.coatingDetails || data.coatingDetails.length === 0) {
            data.coatingDetails = defaultCoatingDetails;
          }
          
          // Format dates for display
          const formattedData = {
            ...data,
            issueDate: data.issueDate?.split('T')[0],
            reviewedDate: data.reviewedDate?.split('T')[0],
            inspectionDate: data.inspectionDate?.split('T')[0]
          };
          
          setFormData(formattedData);
        } catch (error) {
          console.error('Error fetching form:', error);
          setError('Failed to load inspection form. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchForm();
    }
  }, [id, isNew]);

  // Update permissions based on user role and form status
  useEffect(() => {
    if (user && formData) {
      const isOperator = user.role === 'operator';
      const isQA = user.role === 'qa';
      const isAVP = user.role === 'avp';
      const isMaster = user.role === 'master';

      const isDraft = formData.status === 'DRAFT';
      const isSubmitted = formData.status === 'SUBMITTED';
      const isApproved = formData.status === 'APPROVED';
      const isRejected = formData.status === 'REJECTED';

      setPermissions({
        canEditDocumentInfo: (isOperator && isDraft) || isMaster,
        canEditInspectionDetails: (isOperator && isDraft) || isMaster,
        canEditCoatingDetails: (isOperator && isDraft) || isMaster,
        canEditCharacteristics: (isQA && isSubmitted) || (isOperator && isDraft) || isMaster,
        canSubmit: (isOperator && isDraft),
        canQASubmit: (isQA && isSubmitted),
        canQAReject: (isQA && isSubmitted),
        canApprove: (isAVP && isSubmitted),
        canReject: (isAVP && isSubmitted),
        canSaveDraft: (isOperator && isDraft) || isMaster,
        canDownloadPdf: isApproved || isMaster,
        canEmailPdf: isApproved || isMaster
      });
    }
  }, [user, formData]);

  // Variant options
  const variantOptions = ['Pink matt', 'Blue matt', 'Green matt', 'Yellow matt'];

  // Shift options
  const shiftOptions = ['A', 'B', 'C'];

  // Line number options
  const lineOptions = ['01', '02', '03', '04', '05'];

  // Lacquer type options
  const lacquerOptions = [
    'Clear Extn', 
    'Red Dye', 
    'Black Dye', 
    'Pink Dye', 
    'Violet Dye', 
    'Matt Bath',
    'Hardener'
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle document info changes
  const handleDocumentInfoChange = (name, value) => {
    // Map common component field names to your form field names
    const fieldMap = {
      'revision': 'issuanceNo',
      'effectiveDate': 'issueDate',
      'reviewedOn': 'reviewedDate',
      'issuedBy': 'issued'
    };

    const formField = fieldMap[name] || name;
    setFormData(prev => ({ ...prev, [formField]: value }));
  };

  // Handle email sending
  const handleSendEmail = async (emailData) => {
    if (!id) return;

    try {
      setSendingEmail(true);
      console.log("Starting to send email for form ID:", id);
      console.log("Email data:", emailData);

      // Call the API to send email with attached PDF
      const result = await coatingInspectionAPI.sendEmailWithPdf(id, emailData, user.name);
      console.log("Email API response:", result);

      // Show success message and close modal
      alert('Email sent successfully!');
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.message || 'Please try again'}`);
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle coating detail changes
  const handleCoatingDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.coatingDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value
    };

    // Update batch composition if necessary
    const batchComposition = generateBatchComposition(updatedDetails);
    
    setFormData(prev => ({
      ...prev,
      coatingDetails: updatedDetails,
      batchComposition: batchComposition
    }));

    // Also update the batch composition in characteristics
    const batchCompositionIndex = formData.characteristics.findIndex(c => c.name === 'Batch Composition');
    if (batchCompositionIndex !== -1) {
      const updatedCharacteristics = [...formData.characteristics];
      updatedCharacteristics[batchCompositionIndex] = {
        ...updatedCharacteristics[batchCompositionIndex],
        observation: batchComposition
      };

      setFormData(prev => ({
        ...prev,
        characteristics: updatedCharacteristics
      }));
    }
  };

  // Generate batch composition text from coating details
  const generateBatchComposition = (details) => {
    return details
      .filter(d => d.lacquerType && d.quantity)
      .map(d => `${d.lacquerType} ${d.quantity}`)
      .join(' ');
  };

  // Handle characteristic changes
  const handleCharChange = (index, field, value) => {
    const updatedChars = [...formData.characteristics];
    updatedChars[index] = {
      ...updatedChars[index],
      [field]: value
    };

    // Update specific form fields based on characteristic
    const newFormData = { ...formData, characteristics: updatedChars };
    
    // Map characteristic observations to specific fields
    const char = updatedChars[index];
    const name = char.name.toLowerCase().replace(/\s+/g, '');
    
    if (name === 'colourshade' || name === 'colorshade') {
      newFormData.colorShade = field === 'observation' ? value : char.observation;
    } else if (name === 'colourheight' || name === 'colorheight') {
      newFormData.colorHeight = field === 'observation' ? value : char.observation;
    } else if (name.includes('visual')) {
      newFormData.visualDefect = field === 'observation' ? value : char.observation;
    } else if (name.includes('mek')) {
      newFormData.mekTest = field === 'observation' ? value : char.observation;
    } else if (name.includes('crosscut') || name.includes('tape')) {
      newFormData.crossCutTest = field === 'observation' ? value : char.observation;
    } else if (name.includes('thickness') && field === 'bodyThickness') {
      newFormData.coatingThicknessBody = value;
    } else if (name.includes('thickness') && field === 'bottomThickness') {
      newFormData.coatingThicknessBottom = value;
    } else if (name.includes('temperature')) {
      newFormData.temperature = field === 'observation' ? value : char.observation;
    } else if (name.includes('viscosity')) {
      newFormData.viscosity = field === 'observation' ? value : char.observation;
    } else if (name.includes('batch')) {
      newFormData.batchComposition = field === 'observation' ? value : char.observation;
    }

    setFormData(newFormData);
  };

  // Sanitize form data for API submission
  const sanitizeFormData = (data) => {
    // Create a deep copy to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Format dates properly
    if (sanitized.issueDate && !sanitized.issueDate.includes('T')) {
      sanitized.issueDate += 'T00:00:00';
    }
    
    if (sanitized.reviewedDate && !sanitized.reviewedDate.includes('T')) {
      sanitized.reviewedDate += 'T00:00:00';
    }
    
    if (sanitized.inspectionDate && !sanitized.inspectionDate.includes('T')) {
      sanitized.inspectionDate += 'T00:00:00';
    }
    
    return sanitized;
  };

  // Save form data
  const saveForm = async (newStatus) => {
    try {
      setSaving(true);

      const updatedFormData = {
        ...formData,
        status: newStatus,
        submittedBy: (newStatus === 'SUBMITTED' && !formData.submittedBy) ? user.name : formData.submittedBy,
        submittedAt: (newStatus === 'SUBMITTED' && !formData.submittedAt) ? new Date().toISOString() : formData.submittedAt,
        reviewedBy: (newStatus === 'APPROVED' || newStatus === 'REJECTED') ? user.name : formData.reviewedBy,
        reviewedAt: (newStatus === 'APPROVED' || newStatus === 'REJECTED') ? new Date().toISOString() : formData.reviewedAt,
      };

      // If operator is submitting, add their signature
      if (user.role === 'operator' && newStatus === 'SUBMITTED' && !updatedFormData.operatorSignature) {
        updatedFormData.operatorName = user.name;
        updatedFormData.operatorSignature = `signed_by_${user.name.toLowerCase().replace(/\\s/g, '_')}`;
      }

      // If QA is approving/rejecting, add their signature
      if ((user.role === 'qa' || user.role === 'avp') && 
          (newStatus === 'APPROVED' || newStatus === 'REJECTED') && 
          !updatedFormData.qaSignature) {
        updatedFormData.qaName = user.name;
        updatedFormData.qaSignature = `signed_by_${user.name.toLowerCase().replace(/\\s/g, '_')}`;
        updatedFormData.approvalTime = new Date().toLocaleTimeString();
      }

      // Sanitize form data for API submission
      const sanitizedData = sanitizeFormData(updatedFormData);

      // Update or create the report
      let result;
      if (id && !isNew) {
        result = await coatingInspectionAPI.updateReport(id, sanitizedData);
      } else {
        result = await coatingInspectionAPI.createReport(sanitizedData);
      }

      alert(`Form ${id && !isNew ? 'updated' : 'created'} successfully!`);
      navigate('/forms/coating');
      return result;
    } catch (error) {
      console.error('Error saving form:', error);
      alert(`Failed to ${id && !isNew ? 'update' : 'create'} form. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  // Save as draft
  const saveDraft = async () => {
    try {
      await saveForm('DRAFT');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save form as draft. Please try again.');
    }
  };

  // Submit the form for QA approval
  const submitForm = async () => {
    try {
      await saveForm('SUBMITTED');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form for approval. Please try again.');
    }
  };

  // QA submits the form to AVP
  const qaSubmitForm = async () => {
    try {
      // Add QA signature
      const updatedFormData = {
        ...formData,
        qaName: user.name,
        qaSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`,
        reviewedBy: user.name,
        reviewedAt: new Date().toISOString(),
        status: 'SUBMITTED'
      };

      setSaving(true);
      const sanitizedData = sanitizeFormData(updatedFormData);
      await coatingInspectionAPI.updateReport(id, sanitizedData);
      alert('Form submitted to AVP for approval!');
      navigate('/forms/coating');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form to AVP. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // QA rejects the form
  const qaRejectForm = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const comments = window.prompt('Please provide rejection reason:');
      if (!comments) {
        alert('Rejection reason is required.');
        return;
      }

      const updatedFormData = {
        ...formData,
        reviewedBy: user.name,
        reviewedAt: new Date().toISOString(),
        status: 'REJECTED',
        comments: comments
      };

      const sanitizedData = sanitizeFormData(updatedFormData);
      await coatingInspectionAPI.updateReport(id, sanitizedData);
      alert('Form rejected successfully!');
      navigate('/forms/coating');
    } catch (error) {
      console.error('Error rejecting form:', error);
      alert('Failed to reject form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // AVP approves the form
  const approveForm = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const updatedFormData = {
        ...formData,
        qaName: user.name,
        qaSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`,
        approvalTime: new Date().toLocaleTimeString(),
        status: 'APPROVED'
      };

      const comments = window.prompt('Add any approval comments (optional):');
      if (comments) {
        updatedFormData.comments = comments;
      }

      const sanitizedData = sanitizeFormData(updatedFormData);
      await coatingInspectionAPI.updateReport(id, sanitizedData);
      alert('Form approved successfully!');
      navigate('/forms/coating');
    } catch (error) {
      console.error('Error approving form:', error);
      alert('Failed to approve form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // AVP rejects the form
  const rejectForm = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const comments = window.prompt('Please provide rejection reason:');
      if (!comments) {
        alert('Rejection reason is required.');
        return;
      }

      const updatedFormData = {
        ...formData,
        qaName: user.name,
        qaSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`,
        approvalTime: new Date().toLocaleTimeString(),
        status: 'REJECTED',
        comments: comments
      };

      const sanitizedData = sanitizeFormData(updatedFormData);
      await coatingInspectionAPI.updateReport(id, sanitizedData);
      alert('Form rejected successfully!');
      navigate('/forms/coating');
    } catch (error) {
      console.error('Error rejecting form:', error);
      alert('Failed to reject form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Download PDF
  const downloadPdf = async () => {
    try {
      const userName = user?.name || 'Anonymous';
      await coatingInspectionAPI.downloadPdf(id, userName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // Handle email success
  const handleEmailSuccess = () => {
    alert('Email sent successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading inspection form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 p-4">
      <form className="w-full max-w-4xl bg-white shadow-md pt-16">
        {/* Email Modal Component */}
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          formId={id}
          onSuccess={handleEmailSuccess}
        />

        {/* Form Status Banner */}
        <StatusBanner
          status={formData.status}
          submittedBy={formData.submittedBy}
        />

        {/* Header */}
        <FormHeader
          documentInfo={{
            documentNo: formData.documentNo,
            revision: formData.issuanceNo,
            effectiveDate: formData.issueDate,
            reviewedOn: formData.reviewedDate,
            page: formData.page,
            preparedBy: formData.preparedBy,
            approvedBy: formData.approvedBy,
            issuedBy: formData.issued,
            title: "FIRST ARTICLE INSPECTION REPORT - COATING"
          }}
          scope="AGI / DEC / COATING"
          unit="AGI Speciality Glass Division"
          onDocumentInfoChange={handleDocumentInfoChange}
          readOnly={!permissions.canEditDocumentInfo}
        />

        <div className="border-x border-b border-gray-800">
          <div className="grid grid-cols-3 text-sm">
            <div className="border-r border-gray-800">
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Date: </span>
                {permissions.canEditInspectionDetails ? (
                  <input
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleChange}
                    className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                ) : (
                  <span>{formData.inspectionDate}</span>
                )}
              </div>
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Product: </span>
                {permissions.canEditInspectionDetails ? (
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                ) : (
                  <span>{formData.product}</span>
                )}
              </div>
              <div className="p-2">
                <span className="font-semibold">Size No.: </span>
                {permissions.canEditInspectionDetails ? (
                  <input
                    type="text"
                    name="sizeNo"
                    value={formData.sizeNo}
                    onChange={handleChange}
                    className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                ) : (
                  <span>{formData.sizeNo}</span>
                )}
              </div>
            </div>
            <div className="border-r border-gray-800">
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Shift: </span>
                {permissions.canEditInspectionDetails ? (
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
                ) : (
                  <span>{formData.shift}</span>
                )}
              </div>
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Variant: </span>
                {permissions.canEditInspectionDetails ? (
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
                ) : (
                  <span>{formData.variant}</span>
                )}
              </div>
              <div className="p-2"></div>
            </div>
            <div>
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Line No.: </span>
                {permissions.canEditInspectionDetails ? (
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
                ) : (
                  <span>{formData.lineNo}</span>
                )}
              </div>
              <div className="border-b border-gray-800 p-2">
                <span className="font-semibold">Customer: </span>
                {permissions.canEditInspectionDetails ? (
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                ) : (
                  <span>{formData.customer}</span>
                )}
              </div>
              <div className="p-2">
                <span className="font-semibold">Sample Size: </span>
                {permissions.canEditInspectionDetails ? (
                  <input
                    type="text"
                    name="sampleSize"
                    value={formData.sampleSize}
                    onChange={handleChange}
                    className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                ) : (
                  <span>{formData.sampleSize}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coating Details Table */}
        <div className="relative">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-800 p-2 w-12 bg-gray-200">S.No.</th>
                <th className="border border-gray-800 p-2 bg-gray-200">Lacquer / Dye</th>
                <th className="border border-gray-800 p-2 bg-gray-200">Batch No.</th>
                <th className="border border-gray-800 p-2 bg-gray-200">Qty.</th>
                {/* <th className="border border-gray-800 p-2 bg-gray-200">No. of Pieces</th> */}
                <th className="border border-gray-800 p-2 bg-gray-200">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {formData.coatingDetails.map((detail, index) => {
                // Define unit based on the selected lacquer/dye
                let unit = "GM";
                if (detail.lacquerType === "Clear Extn") {
                  unit = "KG";
                }

                return (
                  <tr key={detail.id}>
                    <td className="border border-gray-800 p-2 text-center">{detail.id}</td>
                    <td className="border border-gray-800 p-2">
                      {permissions.canEditCoatingDetails ? (
                        <select
                          value={detail.lacquerType}
                          onChange={(e) => handleCoatingDetailChange(index, 'lacquerType', e.target.value)}
                          className="w-full px-1 py-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        >
                          <option value="">Select Lacquer/Dye</option>
                          {lacquerOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="px-1 py-1">{detail.lacquerType}</div>
                      )}
                    </td>
                    <td className="border border-gray-800 p-2 text-center">
                      {permissions.canEditCoatingDetails ? (
                        <input
                          type="text"
                          value={detail.batchNo}
                          onChange={(e) => handleCoatingDetailChange(index, 'batchNo', e.target.value)}
                          className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      ) : (
                        <div>{detail.batchNo}</div>
                      )}
                    </td>
                    <td className="border border-gray-800 p-2 text-center">
                      <div className="flex items-center">
                        {permissions.canEditCoatingDetails ? (
                          <>
                            <input
                              type="text"
                              value={detail.quantity}
                              onChange={(e) => handleCoatingDetailChange(index, 'quantity', e.target.value)}
                              className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                            {detail.lacquerType && (
                              <span className="ml-1 text-gray-500 text-xs whitespace-nowrap">{unit}</span>
                            )}
                          </>
                        ) : (
                          <div>
                            {detail.quantity} {detail.lacquerType && unit}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* <td className="border border-gray-800 p-2 text-center">
                      {permissions.canEditCoatingDetails ? (
                        <input
                          type="text"
                          value={detail.numberOfPieces}
                          onChange={(e) => handleCoatingDetailChange(index, 'numberOfPieces', e.target.value)}
                          className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      ) : (
                        <div>{detail.numberOfPieces}</div>
                      )}
                    </td> */}
                    <td className="border border-gray-800 p-2 text-center">
                      {permissions.canEditCoatingDetails ? (
                        <input
                          type="date"
                          value={detail.expiryDate}
                          onChange={(e) => handleCoatingDetailChange(index, 'expiryDate', e.target.value)}
                          className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      ) : (
                        <div>{detail.expiryDate}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Add Row button for Coating Details */}
          {permissions.canEditCoatingDetails && (
            <button
              type="button"
              onClick={() => {
                const newId = formData.coatingDetails.length > 0
                  ? Math.max(...formData.coatingDetails.map(d => d.id)) + 1
                  : 1;

                const updatedDetails = [
                  ...formData.coatingDetails,
                  { id: newId, lacquerType: '', batchNo: '', quantity: '', expiryDate: '' }
                ];

                setFormData({
                  ...formData,
                  coatingDetails: updatedDetails
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

        {/* Characteristics Table */}
        <div className="mt-px">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-800 p-2 w-12 bg-gray-200">S.No.</th>
                <th className="border border-gray-800 p-2 bg-gray-200">Characteristic</th>
                <th className="border border-gray-800 p-2 bg-gray-200">
                  <div>As per Reference sample no. X-211</div>
                  <div>Observations</div>
                </th>
                <th className="border border-gray-800 p-2 bg-gray-200">Comments</th>
              </tr>
            </thead>
            <tbody>
              {formData.characteristics.map((char, index) => (
                <tr key={char.id}>
                  <td className="border border-gray-800 p-2 text-center">{char.id}</td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => handleCharChange(index, 'name', e.target.value)}
                      disabled={!permissions.canEditCharacteristics}
                      className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </td>
                  <td className="border border-gray-800">
                    {char.id === 6 ? (
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border-b border-r border-gray-800 p-2 w-30 text-center font-semibold h-12">Body</td>
                            <td className="border-b border-gray-800 p-2 text-center h-12">
                              <input
                                type="text"
                                value={char.bodyThickness || ''}
                                onChange={(e) => handleCharChange(index, 'bodyThickness', e.target.value)}
                                disabled={!permissions.canEditCharacteristics}
                                className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border-r border-gray-800 text-center font-semibold h-12">Bottom</td>
                            <td className="p-2 text-center h-12">
                              <input
                                type="text"
                                value={char.bottomThickness || ''}
                                onChange={(e) => handleCharChange(index, 'bottomThickness', e.target.value)}
                                disabled={!permissions.canEditCharacteristics}
                                className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <input
                        type="text"
                        value={char.observation || ''}
                        onChange={(e) => handleCharChange(index, 'observation', e.target.value)}
                        disabled={!permissions.canEditCharacteristics}
                        className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    )}
                  </td>
                  <td className="border border-gray-800 p-2">
                    <input
                      type="text"
                      value={char.comments || ''}
                      onChange={(e) => handleCharChange(index, 'comments', e.target.value)}
                      disabled={!permissions.canEditCharacteristics}
                      className="w-full px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-x border-b border-gray-800">
          <div className="flex justify-between items-center p-4">
            {/* QA Signature Display */}
            <div className="flex items-center">
              <div className="font-semibold mr-2">QA Exe.</div>
              <div className="w-16">
                {formData.qaSignature ? (
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
                      title={`Signed by: ${formData.qaName}`}
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
                {formData.operatorSignature ? (
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
                      title={`Signed by: ${formData.operatorName}`}
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
              name="approvalTime"
              value={formData.approvalTime}
              onChange={handleChange}
              disabled={!(permissions.canApprove || permissions.canEditDocumentInfo)}
              className="px-1 py-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>

        {/* Review Information */}
        {(formData.status === 'SUBMITTED' || formData.status === 'APPROVED' || formData.status === 'REJECTED') && (
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
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-gray-100 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/forms/coating')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Back to Forms
          </button>

          <div className="space-x-2">
            {/* Operator buttons */}
            {permissions.canSaveDraft && (
              <button
                type="button"
                onClick={saveDraft}
                disabled={saving}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
            )}

            {permissions.canSubmit && (
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
            {permissions.canQAReject && (
              <button
                type="button"
                onClick={qaRejectForm}
                disabled={saving}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
              >
                {saving ? 'Rejecting...' : 'Reject Form'}
              </button>
            )}

            {permissions.canQASubmit && (
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
            {permissions.canReject && (
              <button
                type="button"
                onClick={rejectForm}
                disabled={saving}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300"
              >
                {saving ? 'Rejecting...' : 'Reject Form'}
              </button>
            )}

            {permissions.canApprove && (
              <button
                type="button"
                onClick={approveForm}
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-300"
              >
                {saving ? 'Approving...' : 'Approve Form'}
              </button>
            )}

            {/* Download PDF button - visible when approved */}
            {permissions.canDownloadPdf && (
              <button
                type="button"
                onClick={downloadPdf}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Download PDF
              </button>
            )}
            
            {/* Email PDF button - visible when approved */}
            {permissions.canEmailPdf && (
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
      </form>
    </div>
  );
};

export default CoatingInspectionForm;