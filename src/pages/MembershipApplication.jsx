// src/pages/MembershipApplication.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import PublicLayout from '../components/layout/PublicLayout';

const MembershipApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [memberId, setMemberId] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicant: {
      firstName: '',
      middleName: '',
      lastName: '',
      salutation: 'Mr',
      primaryIdentificationType: '1',
      primaryIdentificationNo: '',
      secondaryIdentificationType: '0',
      secondaryIdentificationNo: '',
      pinNumber: '',
      dateOfBirth: '',
      nationality: 'Kenyan',
      currentAddress: '',
      city: '',
      phoneNo: '',
      emailAddress: '',
      employerName: '',
      payrollStaffNo: '',
      bankCode: '',
      bankAccountNo: '',
      password: '',
      confirmPassword: '',
      signatureBlob: '',
      pictureBlob: '',
      filename: '',
      contributionMode: '2'
    },
    nextOfKin: [
      {
        name: '',
        address: '',
        isBeneficiary: true,
        email: '',
        idNumber: '',
        relationship: '',
        dob: '',
        phoneNo: ''
      }
    ]
  });

  // Bank options
  const bankOptions = [
    { value: '01', label: 'Kenya Commercial Bank (KCB)' },
    { value: '02', label: 'Equity Bank' },
    { value: '03', label: 'Co-operative Bank' },
    { value: '04', label: 'Standard Chartered Bank' },
    { value: '05', label: 'Absa Bank' },
    { value: '06', label: 'National Bank' },
    { value: '07', label: 'NCBA Bank' },
    { value: '08', label: 'Diamond Trust Bank (DTB)' },
  ];

  // Relationship options
  const relationshipOptions = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Other Relative', 'Friend'
  ];

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        [name]: value
      }
    }));
  };

  const handleNextOfKinChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      nextOfKin: prev.nextOfKin.map((kin, i) => 
        i === index ? { ...kin, [name]: type === 'checkbox' ? checked : value } : kin
      )
    }));
  };

  const addNextOfKin = () => {
    setFormData(prev => ({
      ...prev,
      nextOfKin: [
        ...prev.nextOfKin,
        {
          name: '',
          address: '',
          isBeneficiary: false,
          email: '',
          idNumber: '',
          relationship: '',
          dob: '',
          phoneNo: ''
        }
      ]
    }));
  };

  const removeNextOfKin = (index) => {
    if (formData.nextOfKin.length > 1) {
      setFormData(prev => ({
        ...prev,
        nextOfKin: prev.nextOfKin.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage('File size must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setFormData(prev => ({
          ...prev,
          applicant: {
            ...prev.applicant,
            [field]: base64Data,
            filename: file.name
          }
        }));
      };
      reader.onerror = () => {
        setMessage('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step) => {
    const { applicant } = formData;
    
    switch (step) {
      case 1:
        if (!applicant.firstName || !applicant.lastName || !applicant.primaryIdentificationNo || 
            !applicant.dateOfBirth || !applicant.nationality) {
          setMessage('Please fill in all required personal information');
          return false;
        }
        return true;
      
      case 2:
        if (!applicant.currentAddress || !applicant.city || !applicant.phoneNo || !applicant.emailAddress) {
          setMessage('Please fill in all required contact information');
          return false;
        }
        return true;
      
      case 3:
        if (!applicant.bankCode || !applicant.bankAccountNo) {
          setMessage('Please fill in all required bank information');
          return false;
        }
        return true;
      
      case 4:
        if (!applicant.password || !applicant.confirmPassword) {
          setMessage('Please create a password');
          return false;
        }
        if (applicant.password !== applicant.confirmPassword) {
          setMessage('Passwords do not match');
          return false;
        }
        if (applicant.password.length < 6) {
          setMessage('Password must be at least 6 characters long');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setMessage('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { confirmPassword, ...applicantData } = formData.applicant;
    const submissionData = {
      applicant: applicantData,
      nextOfKin: formData.nextOfKin
    };

    try {
      const response = await authService.submitMembershipApplication(submissionData);
      
      if (response.status === 'success') {
        setApplicationSuccess(true);
        setMemberId(response.memberId);
        setMessage('Membership application submitted successfully!');
        
        // Auto-redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        setMessage(response.message || 'Failed to submit application');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  if (applicationSuccess) {
    return (
      <PublicLayout>
        <div className="membership-success">
          <div className="success-container">
            <div className="success-header">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h1>Application Submitted Successfully!</h1>
            </div>
            
            <div className="success-content">
              <p className="success-message">
                Your membership application has been received and is under review.
              </p>
              
              <div className="reference-section">
                <div className="reference-card">
                  <div className="reference-icon">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <div className="reference-details">
                    <h3>Reference Number</h3>
                    <div className="reference-number">{memberId}</div>
                    <p>Keep this number for future reference</p>
                  </div>
                </div>
              </div>

              <div className="next-steps">
                <h2>What happens next?</h2>
                <div className="steps-grid">
                  <div className="step-item">
                    <div className="step-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="step-content">
                      <h4>Confirmation Email</h4>
                      <p>You will receive a confirmation email shortly</p>
                    </div>
                  </div>
                  
                  <div className="step-item">
                    <div className="step-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="step-content">
                      <h4>Application Review</h4>
                      <p>Our team will review your application within 2-3 business days</p>
                    </div>
                  </div>
                  
                  <div className="step-item">
                    <div className="step-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="step-content">
                      <h4>Approval Notification</h4>
                      <p>You will be notified once your application is approved</p>
                    </div>
                  </div>
                  
                  <div className="step-item">
                    <div className="step-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="step-content">
                      <h4>Member Access</h4>
                      <p>Upon approval, you can login to access all member features</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="auto-redirect">
                <p>You will be automatically redirected to the login page in 5 seconds...</p>
              </div>
            </div>

            <div className="success-actions">
              <button 
                onClick={() => navigate('/login')}
                className="primary-button"
              >
                <i className="fas fa-sign-in-alt"></i>
                Go to Login Now
              </button>
              <button 
                onClick={() => {
                  setApplicationSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    applicant: {
                      firstName: '',
                      middleName: '',
                      lastName: '',
                      salutation: 'Mr',
                      primaryIdentificationType: '1',
                      primaryIdentificationNo: '',
                      secondaryIdentificationType: '0',
                      secondaryIdentificationNo: '',
                      pinNumber: '',
                      dateOfBirth: '',
                      nationality: 'Kenyan',
                      currentAddress: '',
                      city: '',
                      phoneNo: '',
                      emailAddress: '',
                      employerName: '',
                      payrollStaffNo: '',
                      bankCode: '',
                      bankAccountNo: '',
                      password: '',
                      confirmPassword: '',
                      signatureBlob: '',
                      pictureBlob: '',
                      filename: '',
                      contributionMode: '2'
                    },
                    nextOfKin: [
                      {
                        name: '',
                        address: '',
                        isBeneficiary: true,
                        email: '',
                        idNumber: '',
                        relationship: '',
                        dob: '',
                        phoneNo: ''
                      }
                    ]
                  });
                }}
                className="secondary-button"
              >
                <i className="fas fa-plus"></i>
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="membership-application">
        <div className="application-container">
          <div className="application-header">
            <h1>Membership Application</h1>
            <p>Join Ushuru Investment Co-operative Society and start your investment journey</p>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className={`progress-step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Contact Info'}
                  {step === 3 && 'Bank Details'}
                  {step === 4 && 'Security'}
                  {step === 5 && 'Review'}
                </div>
              </div>
            ))}
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="application-form">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2>Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Salutation *</label>
                    <select name="salutation" value={formData.applicant.salutation} onChange={handleApplicantChange}>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.applicant.firstName}
                      onChange={handleApplicantChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.applicant.middleName}
                      onChange={handleApplicantChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.applicant.lastName}
                      onChange={handleApplicantChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>National ID Number *</label>
                    <input
                      type="text"
                      name="primaryIdentificationNo"
                      value={formData.applicant.primaryIdentificationNo}
                      onChange={handleApplicantChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>KRA PIN Number</label>
                    <input
                      type="text"
                      name="pinNumber"
                      value={formData.applicant.pinNumber}
                      onChange={handleApplicantChange}
                    />
                  </div>
                </div>

                {/* ADDED: Secondary Identification Fields */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Secondary ID Type</label>
                    <select name="secondaryIdentificationType" value={formData.applicant.secondaryIdentificationType} onChange={handleApplicantChange}>
                      <option value="0">None</option>
                      <option value="2">Passport</option>
                      <option value="3">Driving License</option>
                      <option value="4">Alien ID</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Secondary ID Number</label>
                    <input
                      type="text"
                      name="secondaryIdentificationNo"
                      value={formData.applicant.secondaryIdentificationNo}
                      onChange={handleApplicantChange}
                      placeholder="If applicable"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.applicant.dateOfBirth}
                      onChange={handleApplicantChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.applicant.nationality}
                      onChange={handleApplicantChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Steps 2-5 remain the same as before */}
            {/* ... existing steps 2-5 code ... */}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="nav-button prev-button">
                  Previous
                </button>
              )}
              
              {currentStep < 5 ? (
                <button type="button" onClick={nextStep} className="nav-button next-button">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>

        <style jsx>{`
.membership-application {
            min-height: calc(100vh - 140px);
            padding: 2rem 1rem;
            background-color: #f9fafb;
          }

          .application-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }

          .application-header {
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            color: white;
            padding: 2rem;
            text-align: center;
          }

          .application-header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
            font-weight: bold;
          }

          .application-header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.125rem;
          }

          /* Progress Bar */
          .progress-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;
          }

          .progress-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 1rem;
            left: 60%;
            right: -40%;
            height: 2px;
            background-color: #e9ecef;
            z-index: 1;
          }

          .progress-step.completed:not(:last-child)::after {
            background-color: #28a745;
          }

          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background-color: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 2;
          }

          .progress-step.active .step-number {
            background-color: #7A1F23;
            color: white;
          }

          .progress-step.completed .step-number {
            background-color: #28a745;
            color: white;
          }

          .step-label {
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
            color: #6c757d;
          }

          .progress-step.active .step-label {
            color: #7A1F23;
          }

          .progress-step.completed .step-label {
            color: #28a745;
          }

          /* Form Styles */
          .application-form {
            padding: 2rem;
          }

          .form-step {
            max-width: 800px;
            margin: 0 auto;
          }

          .form-step h2 {
            color: #7A1F23;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 0.5rem;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group.full-width {
            grid-column: 1 / -1;
          }

          .form-group label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #374151;
            font-size: 0.875rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            background-color: white;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #7A1F23;
            box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
          }

          .form-group textarea {
            resize: vertical;
            min-height: 80px;
          }

          /* Next of Kin Section */
          .next-of-kin-section {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #e9ecef;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .section-header h3 {
            color: #7A1F23;
            margin: 0;
            font-size: 1.25rem;
          }

          .remove-button {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .remove-button:hover {
            background-color: #c82333;
          }

          .checkbox-group {
            margin-top: 1rem;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: normal;
          }

          .checkbox-label input[type="checkbox"] {
            width: 1rem;
            height: 1rem;
          }

          .add-kin-button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 2rem;
          }

          .add-kin-button:hover {
            background-color: #218838;
          }

          /* Review Section */
          .review-section {
            background-color: #f0f9ff;
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid #bae6fd;
            margin-top: 2rem;
          }

          .review-section h3 {
            color: #0369a1;
            margin-bottom: 1rem;
          }

          .review-summary ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .review-summary li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .review-summary li:last-child {
            border-bottom: none;
          }
            
          /* Enhanced Success Page Styles */
          .membership-success {
            min-height: calc(100vh - 140px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }

          .success-container {
            background: white;
            padding: 3rem;
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            border: 1px solid #e9ecef;
          }

          .success-header {
            margin-bottom: 2rem;
          }

          .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
          }

          .success-icon i {
            filter: drop-shadow(0 4px 8px rgba(40, 167, 69, 0.3));
          }

          .success-container h1 {
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #7A1F23 0%, #2d3748 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .success-content {
            margin-bottom: 2.5rem;
          }

          .success-message {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .reference-section {
            margin-bottom: 2.5rem;
          }

          .reference-card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #bae6fd;
            border-radius: 1rem;
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            text-align: left;
          }

          .reference-icon {
            width: 4rem;
            height: 4rem;
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            flex-shrink: 0;
          }

          .reference-details h3 {
            color: #1e40af;
            margin: 0 0 0.5rem 0;
            font-size: 1.125rem;
            font-weight: 600;
          }

          .reference-number {
            font-size: 1.75rem;
            font-weight: 700;
            color: #7A1F23;
            margin-bottom: 0.5rem;
            font-family: 'Courier New', monospace;
          }

          .reference-details p {
            color: #6b7280;
            margin: 0;
            font-size: 0.875rem;
          }

          .next-steps {
            text-align: left;
          }

          .next-steps h2 {
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
          }

          .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .step-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }

          .step-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-color: #7A1F23;
          }

          .step-icon {
            width: 3rem;
            height: 3rem;
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.25rem;
            margin: 0 auto 1rem auto;
          }

          .step-content h4 {
            color: #2d3748;
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            font-weight: 600;
          }

          .step-content p {
            color: #6b7280;
            margin: 0;
            font-size: 0.875rem;
            line-height: 1.5;
          }

          .auto-redirect {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1.5rem;
          }

          .auto-redirect p {
            color: #856404;
            margin: 0;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .primary-button,
          .secondary-button {
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 200px;
            justify-content: center;
          }

          .primary-button {
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(122, 31, 35, 0.3);
          }

          .primary-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(122, 31, 35, 0.4);
          }

          .secondary-button {
            background: white;
            color: #374151;
            border: 2px solid #d1d5db;
          }

          .secondary-button:hover {
            background: #f9fafb;
            border-color: #9ca3af;
            transform: translateY(-2px);
          }

          /* Responsive Design for Success Page */
          @media (max-width: 768px) {
            .success-container {
              padding: 2rem 1.5rem;
            }

            .success-container h1 {
              font-size: 2rem;
            }

            .success-message {
              font-size: 1.125rem;
            }

            .reference-card {
              flex-direction: column;
              text-align: center;
              padding: 1.5rem;
            }

            .steps-grid {
              grid-template-columns: 1fr;
            }

            .success-actions {
              flex-direction: column;
            }

            .primary-button,
            .secondary-button {
              width: 100%;
              min-width: auto;
            }
          }

          @media (max-width: 480px) {
            .success-container {
              padding: 1.5rem 1rem;
            }

            .success-container h1 {
              font-size: 1.75rem;
            }

            .reference-number {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
};

export default MembershipApplication;