// Implementation of a reusable inspection form
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import our component library
import FormHeader from './FormHeader';
import FormStatusBanner from './FormStatusBanner';
import InspectionDetails from './InspectionDetails';
import LacquersTable from './LacquersTable';
import InksTable from './InksTable';
import CharacteristicsTable from './CharacteristicsTable';
import FormFooter from './FormFooter';
import ReviewInformation from './ReviewInformation';
import ActionButtons from './ActionButtons';
import EmailModal from '../email/EmailModal';

// Import API services
import { inspectionFormAPI } from '../api';

// Import assets
// import QASign from '../assets/QASign.png';
// import OperatorSign from '../assets/OperatorSign.png';
import QASign from '../../assets/QASign.png';
import OperatorSign from '../../assets/OperatorSign.png';

const InspectionForm = ({ formType = 'coating' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(id ? true : false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // State for email modal
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Define permissions based on user role and form status
    const [permissions, setPermissions] = useState({
        canEditDocumentInfo: false,
        canEditInspectionDetails: false,
        canEditLacquers: false,
        canEditInks: false,
        canEditCharacteristics: false,
        canSubmit: false,
        canApprove: false,
        canReject: false,
        canSaveDraft: false,
        canDownloadPdf: false
    });

    // Initialize form data based on form type
    const getInitialFormData = () => {
        const baseFormData = {
            documentNo: '',
            issuanceNo: '00',
            issueDate: new Date().toISOString().split('T')[0],
            reviewedDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0],
            page: '1 of 1',
            preparedBy: 'QQM QC',
            approvedBy: 'AVP-QA & SYS',
            issued: 'AVP-QA & SYS',
            inspectionDate: new Date().toISOString().split('T')[0],
            shift: 'C',
            lineNo: '02',
            customer: '',
            sampleSize: '08 Nos.',
            qaExecutive: '',
            qaSignature: null,
            productionOperator: '',
            operatorSignature: null,
            finalApprovalTime: '',
            status: 'DRAFT',
            submittedBy: '',
            submittedAt: null,
            reviewedBy: '',
            reviewedAt: null,
            comments: ''
        };

        if (formType === 'coating') {
            return {
                ...baseFormData,
                product: '100 mL Bag Pke.',
                sizeNo: '',
                variant: 'Pink matt',
                scope: 'AGI / DEC / COATING',
                title: 'FIRST ARTICLE INSPECTION REPORT - COATING',
                lacquers: [
                    { id: 1, name: 'Clear Extn', weight: '', batchNo: '', expiryDate: '' },
                    { id: 2, name: 'Red Dye', weight: '', batchNo: '', expiryDate: '' },
                    { id: 3, name: 'Black Dye', weight: '', batchNo: '', expiryDate: '' },
                    { id: 4, name: 'Pink Dye', weight: '', batchNo: '', expiryDate: '' },
                    { id: 5, name: 'Violet Dye', weight: '', batchNo: '', expiryDate: '' },
                    { id: 6, name: 'Matt Bath', weight: '', batchNo: '', expiryDate: '' },
                    { id: 7, name: 'Hardener', weight: '', batchNo: '', expiryDate: '' },
                    { id: 8, name: '', weight: '', batchNo: '', expiryDate: '' },
                ],
                characteristics: [
                    { id: 1, name: 'Colour Shade', observation: '', comments: '' },
                    { id: 2, name: '(Colour Height)', observation: '', comments: '' },
                    { id: 3, name: 'Any Visual defect', observation: '', comments: '' },
                    { id: 4, name: 'MEK Test', observation: '', comments: '' },
                    { id: 5, name: 'Cross Cut Test (Tape Test)', observation: '', comments: '' },
                    { id: 6, name: 'Coating Thickness', bodyThickness: '', bottomThickness: '', comments: '' },
                    { id: 7, name: 'Temperature', observation: '', comments: '' },
                    { id: 8, name: 'Viscosity', observation: '', comments: '' },
                    { id: 9, name: 'Batch Composition', observation: '', comments: '' }
                ]
            };
        } else if (formType === 'printing') {
            return {
                ...baseFormData,
                product: '100 mL Jar',
                sizeNo: 'R-001',
                variant: 'BLUE HORSE AND TANK',
                lineNo: '03',
                mcNo: 'CNC 03',
                scope: 'AGI / DEC / PRINTING',
                title: 'FIRST ARTICLE INSPECTION REPORT - PRINTING',
                inks: [
                    { id: 1, name: 'Black Ink', batchNo: '', expiryDate: '' },
                    { id: 2, name: 'Blue Ink', batchNo: '', expiryDate: '' },
                    { id: 3, name: 'Red Ink', batchNo: '', expiryDate: '' },
                    { id: 4, name: 'White Ink', batchNo: '', expiryDate: '' },
                    { id: 5, name: 'Yellow Ink', batchNo: '', expiryDate: '' },
                    { id: 6, name: 'Green Ink', batchNo: '', expiryDate: '' },
                    { id: 7, name: '', batchNo: '', expiryDate: '' },
                    { id: 8, name: '', batchNo: '', expiryDate: '' },
                ],
                characteristics: [
                    { id: 1, name: 'Colour Shade', observation: '', comments: '' },
                    { id: 2, name: 'Printing Position', vertical: '', horizontal: '', comments: '' },
                    { id: 3, name: 'Deposition of ink', observation: '', comments: '' },
                    { id: 4, name: 'Marking Sample', observation: '', comments: '' },
                    { id: 5, name: 'Art work / Positive', observation: '', comments: '' },
                    { id: 6, name: 'Run File', observation: '', comments: '' },
                    { id: 7, name: 'Printing Ink (Type)', observation: '', comments: '' },
                    { id: 8, name: 'Any Visual Defect', observation: '', comments: '' },
                    { id: 9, name: 'Batch Composition', observation: '', comments: '' }
                ]
            };
        }
        
        // Default to coating if not specified
        return baseFormData;
    };

    // State for form data
    const [formData, setFormData] = useState(getInitialFormData());

    // Form option definitions based on form type
    const getFormOptions = () => {
        if (formType === 'coating') {
            return {
                variantOptions: ['Pink matt', 'Blue matt', 'Green matt', 'Yellow matt'],
                shiftOptions: ['A', 'B', 'C'],
                lineOptions: ['01', '02', '03', '04', '05']
            };
        } else if (formType === 'printing') {
            return {
                variantOptions: ['BLUE HORSE AND TANK', 'RED PATTERN', 'GREEN DESIGN', 'GOLD LETTERING'],
                shiftOptions: ['A', 'B', 'C'],
                lineOptions: ['01', '02', '03', '04', '05'],
                mcOptions: ['CNC 01', 'CNC 02', 'CNC 03', 'CNC 04']
            };
        }
        
        // Default to coating if not specified
        return {
            variantOptions: ['Pink matt', 'Blue matt', 'Green matt', 'Yellow matt'],
            shiftOptions: ['A', 'B', 'C'],
            lineOptions: ['01', '02', '03', '04', '05']
        };
    };

    const formOptions = getFormOptions();

    // Fetch form data if editing an existing form 
    useEffect(() => {
        if (id) {
            const fetchForm = async () => {
                try {
                    setLoading(true);
                    const data = await inspectionFormAPI.getFormById(id);
                    setFormData(data);
                } catch (error) {
                    console.error('Error fetching form:', error);
                    setError('Failed to load inspection form. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

            fetchForm();
        }
    }, [id]);

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
                // Admin can edit anything
                canEditDocumentInfo: (isOperator && isDraft),

                // Operators can edit details in draft state
                canEditInspectionDetails: (isOperator && isDraft),

                // Operators can edit lacquers/inks in draft state
                canEditLacquers: (isOperator && isDraft),
                canEditInks: (isOperator && isDraft),

                // QA can edit characteristics when submitted
                canEditCharacteristics: (isQA && isSubmitted) || (isOperator && isDraft),

                // Operators can submit drafts
                canSubmit: (isOperator && isDraft),

                // QA can submit the form after reviewing
                canQASubmit: (isQA && isSubmitted),

                // QA can reject
                canQAReject: (isQA && isSubmitted),

                // AVP can approve submitted forms
                canApprove: (isAVP && isSubmitted),

                // AVP can reject submitted forms
                canReject: (isAVP && isSubmitted),

                // Operator can save as draft
                canSaveDraft: (isOperator && isDraft),

                // Master can download PDF anytime, others only when approved
                canDownloadPdf: isApproved || isMaster
            });
        }
    }, [user, formData]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Function to handle email sending
    const handleSendEmail = async (emailData) => {
        if (!id) return;

        try {
            setSendingEmail(true);
            console.log("Starting to send email for form ID:", id);
            console.log("Email data:", emailData);

            // Call the API to send email with attached PDF
            const result = await inspectionFormAPI.sendEmailWithPdf(id, emailData);
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

    // Handle lacquer changes
    const handleLacquerChange = (index, field, value) => {
        const updatedLacquers = [...formData.lacquers];
        updatedLacquers[index] = {
            ...updatedLacquers[index],
            [field]: value
        };

        // Update batch composition if necessary
        const batchCompositionIndex = formData.characteristics.findIndex(c => c.name === 'Batch Composition');
        if (batchCompositionIndex !== -1) {
            const composition = generateBatchComposition(updatedLacquers);
            const updatedCharacteristics = [...formData.characteristics];
            updatedCharacteristics[batchCompositionIndex] = {
                ...updatedCharacteristics[batchCompositionIndex],
                observation: composition
            };

            setFormData({
                ...formData,
                lacquers: updatedLacquers,
                characteristics: updatedCharacteristics
            });
        } else {
            setFormData({
                ...formData,
                lacquers: updatedLacquers
            });
        }
    };

    // Handle ink changes (for printing form)
    const handleInkChange = (index, field, value) => {
        const updatedInks = [...formData.inks];
        updatedInks[index] = {
            ...updatedInks[index],
            [field]: value
        };

        // Update batch composition if necessary
        const batchCompositionIndex = formData.characteristics.findIndex(c => c.name === 'Batch Composition');
        if (batchCompositionIndex !== -1) {
            const composition = generateInkComposition(updatedInks);
            const updatedCharacteristics = [...formData.characteristics];
            updatedCharacteristics[batchCompositionIndex] = {
                ...updatedCharacteristics[batchCompositionIndex],
                observation: composition
            };

            setFormData({
                ...formData,
                inks: updatedInks,
                characteristics: updatedCharacteristics
            });
        } else {
            setFormData({
                ...formData,
                inks: updatedInks
            });
        }
    };

    // Generate batch composition text for lacquers
    const generateBatchComposition = (lacquers) => {
        return lacquers
            .filter(l => l.name && l.weight)
            .map(l => `${l.name} ${l.weight}`)
            .join(' ');
    };

    // Generate batch composition text for inks
    const generateInkComposition = (inks) => {
        return inks
            .filter(ink => ink.name && ink.batchNo)
            .map(ink => `${ink.name} ${ink.batchNo}`)
            .join(' ');
    };

    // Handle characteristic changes
    const handleCharChange = (index, field, value) => {
        const updatedChars = [...formData.characteristics];
        updatedChars[index] = {
            ...updatedChars[index],
            [field]: value
        };

        setFormData({
            ...formData,
            characteristics: updatedChars
        });
    };

    // Save the form (create or update)
    const saveForm = async (status = formData.status) => {
        try {
            setSaving(true);

            // Add operator info if missing
            let updatedFormData = {
                ...formData,
                status: status
            };

            // Add submission information if submitting (user name and timestamp)
            if (status === 'SUBMITTED' && user.role === 'operator') {
                updatedFormData = {
                    ...updatedFormData,
                    submittedBy: user.name,
                    submittedAt: new Date().toISOString(),
                };
            }

            // Add operator signature if user is operator
            if (user.role === 'operator' && !updatedFormData.productionOperator) {
                updatedFormData = {
                    ...updatedFormData,
                    productionOperator: user.name,
                    operatorSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`
                };
            }

            let result;
            if (id) {
                // Update existing form
                result = await inspectionFormAPI.updateForm(id, updatedFormData);
            } else {
                // Create new form
                result = await inspectionFormAPI.createForm(updatedFormData);
            }

            alert(`Form ${id ? 'updated' : 'created'} successfully!`);

            // Navigate back to form list or to the newly created form
            if (!id) {
                navigate(`/inspection-form/${result.id}`);
            }

            return result;
        } catch (error) {
            console.error('Error saving form:', error);
            alert(`Failed to ${id ? 'update' : 'create'} form. Please try again.`);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    // Save as draft
    const saveDraft = async () => {
        try {
            await saveForm('DRAFT');
            alert('Form saved as draft!');
            navigate('/forms');
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('Failed to save form as draft. Please try again.');
        }
    };

    // Submit the form for approval (by operator)
    const submitForm = async () => {
        try {
            const saved = await saveForm('SUBMITTED');
            alert('Form submitted for approval!');
            navigate('/forms');
            return saved;
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form for approval. Please try again.');
        }
    };

    // QA submits the form after review
    const qaSubmitForm = async () => {
        try {
            setSaving(true);

            // Create an updated form data object with QA information
            const updatedFormData = {
                ...formData,
                qaExecutive: user.name,
                qaSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`,
                status: 'SUBMITTED'
            };

            // Update the form with QA information
            const result = await inspectionFormAPI.updateForm(id, updatedFormData);

            alert('Form submitted to AVP for approval!');
            navigate('/forms');

            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form to AVP. Please try again.');
        } finally {
            setSaving(false);
        }
    };

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
                qaExecutive: user.name,
                qaSignature: `signed_by_${user.name.toLowerCase().replace(/\s/g, '_')}`,
                status: 'REJECTED',
                comments: comments
            };

            // Update the form
            const result = await inspectionFormAPI.updateForm(id, updatedFormData);

            alert('Form rejected successfully!');
            navigate('/forms');

            return result;
        } catch (error) {
            console.error('Error rejecting form:', error);
            alert('Failed to reject form. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Approve the form (by AVP)
    const approveForm = async () => {
        if (!id) return;

        try {
            setSaving(true);

            // Get optional comments
            const comments = window.prompt('Add any approval comments (optional):');

            // Create an updated form data object with AVP approval info
            const updatedFormData = {
                ...formData,
                reviewedBy: user.name,
                reviewedAt: new Date().toISOString(),
                finalApprovalTime: new Date().toLocaleTimeString(),
                status: 'APPROVED',
                comments: comments || formData.comments
            };

            // Update the local state immediately for UI display
            setFormData(updatedFormData);

            // Update the form with the approval information
            const result = await inspectionFormAPI.updateForm(id, updatedFormData);

            // Update local state with the returned data from the server
            setFormData(result);

            alert('Form approved successfully!');
            navigate('/forms');

            return result;
        } catch (error) {
            console.error('Error approving form:', error);
            alert('Failed to approve form. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Reject the form (by AVP)
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
                reviewedBy: user.name,
                reviewedAt: new Date().toISOString(),
                status: 'REJECTED',
                comments: comments
            };

            // Update the form
            const result = await inspectionFormAPI.updateForm(id, updatedFormData);

            alert('Form rejected successfully!');
            navigate('/forms');

            return result;
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
            const user = JSON.parse(localStorage.getItem('user'));
            const userName = user?.name;

            await inspectionFormAPI.downloadPdf(id, userName);
        } catch (error) {
            alert('Failed to download PDF. Please try again.');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await saveForm();
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
            <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white shadow-md pt-2">
                {/* Email Modal Component */}
                <EmailModal
                    isOpen={isEmailModalOpen}
                    onClose={() => setIsEmailModalOpen(false)}
                    formId={id}
                    onSuccess={handleSendEmail}
                />

                {/* Form Status Banner */}
                <FormStatusBanner 
                    status={formData.status} 
                    submittedBy={formData.submittedBy} 
                />

                {/* Header */}
                <FormHeader 
                    formData={formData} 
                    handleChange={handleChange} 
                    permissions={permissions} 
                />

                {/* Inspection Details */}
                <InspectionDetails 
                    formData={formData} 
                    handleChange={handleChange} 
                    permissions={permissions}
                    shiftOptions={formOptions.shiftOptions}
                    variantOptions={formOptions.variantOptions}
                    lineOptions={formOptions.lineOptions}
                />

                {/* Lacquers or Inks Table based on form type */}
                {formType === 'coating' ? (
                    <LacquersTable 
                        formData={formData} 
                        handleLacquerChange={handleLacquerChange} 
                        permissions={permissions}
                        setFormData={setFormData}
                    />
                ) : (
                    <InksTable 
                        formData={formData} 
                        handleInkChange={handleInkChange} 
                        permissions={permissions}
                        setFormData={setFormData}
                    />
                )}

                {/* Characteristics Table */}
                <CharacteristicsTable 
                    formData={formData} 
                    handleCharChange={handleCharChange} 
                    permissions={permissions} 
                    formType={formType}
                />

                {/* Footer */}
                <FormFooter 
                    formData={formData} 
                    handleChange={handleChange} 
                    permissions={permissions}
                    QASign={QASign}
                    OperatorSign={OperatorSign}
                />

                {/* Review Information */}
                <ReviewInformation formData={formData} />

                {/* Action Buttons */}
                <ActionButtons 
                    navigate={navigate}
                    permissions={permissions}
                    saving={saving}
                    saveDraft={saveDraft}
                    submitForm={submitForm}
                    qaSubmitForm={qaSubmitForm}
                    qaRejectForm={qaRejectForm}
                    approveForm={approveForm}
                    rejectForm={rejectForm}
                    downloadPdf={downloadPdf}
                    setIsEmailModalOpen={setIsEmailModalOpen}
                    formId={id}
                />
            </form>
        </div>
    );
};

export default InspectionForm;