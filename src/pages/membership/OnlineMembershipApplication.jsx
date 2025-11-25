import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/globals.css';

const OnlineMembershipApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    salutation: '',
    primaryIdentificationType: '1',
    primaryIdentificationNo: '',
    secondaryIdentificationType: '1',
    secondaryIdentificationNo: '',
    pinNumber: '',
    dateOfBirth: '',
    nationality: 'Kenyan',
    
    // Contact Information
    currentAddress: '',
    city: 'Nairobi',
    phoneNo: '',
    emailAddress: '',
    
    // Employment Information
    employerName: '',
    payrollStaffNo: '',
    
    // Banking Information
    bankCode: '01',
    bankAccountNo: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    
    // Files
    signature: null,
    picture: null,
    
    // Next of Kin
    nextOfKin: [{
      name: '',
      idType: '1',
      idNumber: '',
      dateOfBirth: '',
      address: '',
      phoneNo: '',
      email: '',
      relationship: ''
    }],
    
    // Contribution
    contributionMode: '2'
  });

  const navigate = useNavigate();

  // Bank options
  const bankOptions = [
    { value: '01', label: 'Kenya Commercial Bank (KCB)' },
    { value: '02', label: 'Equity Bank' },
    { value: '03', label: 'Co-operative Bank' },
    { value: '04', label: 'Standard Chartered Bank' },
    { value: '05', label: 'Barclays Bank' },
    { value: '06', label: 'Absa Bank' },
    { value: '07', label: 'National Bank' },
    { value: '08', label: 'DTB Bank' },
    { value: '09', label: 'NCBA Bank' },
    { value: '10', label: 'Stanbic Bank' }
  ];

  const idTypeOptions = [
    { value: '1', label: 'National ID' },
    { value: '2', label: 'Passport' },
    { value: '3', label: 'Alien ID' },
    { value: '4', label: 'Military ID' }
  ];

  const salutationOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNextOfKinChange = (index, field, value) => {
    const updatedNextOfKin = [...formData.nextOfKin];
    updatedNextOfKin[index][field] = value;
    setFormData(prev => ({
      ...prev,
      nextOfKin: updatedNextOfKin
    }));
  };

  const addNextOfKin = () => {
    setFormData(prev => ({
      ...prev,
      nextOfKin: [
        ...prev.nextOfKin,
        {
          name: '',
          idType: '1',
          idNumber: '',
          dateOfBirth: '',
          address: '',
          phoneNo: '',
          email: '',
          relationship: ''
        }
      ]
    }));
  };

  const removeNextOfKin = (index) => {
    if (formData.nextOfKin.length > 1) {
      const updatedNextOfKin = formData.nextOfKin.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        nextOfKin: updatedNextOfKin
      }));
    }
  };

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.salutation || 
            !formData.primaryIdentificationType || !formData.primaryIdentificationNo ||
            !formData.pinNumber || !formData.dateOfBirth || !formData.currentAddress) {
          setMessage('Please fill in all required personal information fields');
          setMessageType('error');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.phoneNo || !formData.emailAddress || !formData.bankCode || !formData.bankAccountNo) {
          setMessage('Please fill in all required contact and banking information');
          setMessageType('error');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.password || !formData.confirmPassword) {
          setMessage('Please create a password for your account');
          setMessageType('error');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          setMessageType('error');
          return false;
        }
        if (formData.password.length < 6) {
          setMessage('Password must be at least 6 characters long');
          setMessageType('error');
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
    setIsLoading(true);
    setMessage('');

    try {
      // Convert files to base64
      let signatureBlob = '';
      let pictureBlob = '';

      if (formData.signature) {
        signatureBlob = await handleFileToBase64(formData.signature);
      }

      if (formData.picture) {
        pictureBlob = await handleFileToBase64(formData.picture);
      }

      const applicationData = {
        applicant: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          salutation: formData.salutation,
          primaryIdentificationType: formData.primaryIdentificationType,
          primaryIdentificationNo: formData.primaryIdentificationNo,
          secondaryIdentificationType: formData.secondaryIdentificationType,
          secondaryIdentificationNo: formData.secondaryIdentificationNo,
          pinNumber: formData.pinNumber,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          currentAddress: formData.currentAddress,
          city: formData.city,
          phoneNo: formData.phoneNo,
          emailAddress: formData.emailAddress,
          employerName: formData.employerName,
          payrollStaffNo: formData.payrollStaffNo,
          bankCode: formData.bankCode,
          bankAccountNo: formData.bankAccountNo,
          password: formData.password,
          signatureBlob: signatureBlob,
          pictureBlob: pictureBlob,
          filename: formData.signature ? formData.signature.name : 'signature.png',
          contributionMode: formData.contributionMode
        },
        nextOfKin: formData.nextOfKin
      };

      console.log('DEBUG: Submitting application data:', applicationData);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bulk-membership-application/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      console.log('DEBUG: Backend response:', result);

      if (response.ok && result.status === 'success') {
        setMessage('Membership application submitted successfully! You will be contacted soon.');
        setMessageType('success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(result.message || 'Application submission failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('DEBUG: Submission error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="membership-application-page">
      <div className="application-container">
        {/* Header */}
        <div className="application-header">
          <div className="header-content">
            <div className="logo-container">
              <img 
                src="/images/ushuru-logo.png" 
                alt="Ushuru Investment"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="logo-fallback">
                <span>UI</span>
              </div>
            </div>
            <div className="header-text">
              <h1>Online Membership Application</h1>
              <p>Join Ushuru Investment Co-operative Society and start your investment journey</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Personal Info'}
                {step === 2 && 'Contact & Bank'}
                {step === 3 && 'Account Setup'}
                {step === 4 && 'Review & Submit'}
              </div>
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${messageType === 'error' ? 'error-message' : 'success-message'}`}>
            <i className={`fas ${messageType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Salutation *</label>
                <select 
                  name="salutation" 
                  value={formData.salutation} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Salutation</option>
                  {salutationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Primary ID Type *</label>
                <select 
                  name="primaryIdentificationType" 
                  value={formData.primaryIdentificationType} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select ID Type</option>
                  {idTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Primary ID Number *</label>
                <input
                  type="text"
                  name="primaryIdentificationNo"
                  value={formData.primaryIdentificationNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>KRA PIN *</label>
                <input
                  type="text"
                  name="pinNumber"
                  value={formData.pinNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="A123456789X"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Current Address *</label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={nextStep} className="next-button">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact & Banking Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Contact & Banking Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  required
                  placeholder="+254712345678"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Employer Name</label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Payroll Staff No</label>
                <input
                  type="text"
                  name="payrollStaffNo"
                  value={formData.payrollStaffNo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Bank *</label>
                <select 
                  name="bankCode" 
                  value={formData.bankCode} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Bank</option>
                  {bankOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bank Account Number *</label>
                <input
                  type="text"
                  name="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="prev-button">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" onClick={nextStep} className="next-button">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Account Setup */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Account Setup</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Signature Upload</label>
                <input
                  type="file"
                  name="signature"
                  onChange={handleInputChange}
                  accept="image/*,.pdf"
                />
              </div>

              <div className="form-group">
                <label>Profile Picture</label>
                <input
                  type="file"
                  name="picture"
                  onChange={handleInputChange}
                  accept="image/*"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="prev-button">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" onClick={nextStep} className="next-button">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Next of Kin & Review */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Next of Kin Information</h2>
            
            {formData.nextOfKin.map((kin, index) => (
              <div key={index} className="kin-section">
                <div className="kin-header">
                  <h3>Next of Kin {index + 1}</h3>
                  {formData.nextOfKin.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeNextOfKin(index)}
                      className="remove-kin-button"
                    >
                      <i className="fas fa-times"></i> Remove
                    </button>
                  )}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={kin.name}
                      onChange={(e) => handleNextOfKinChange(index, 'name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>ID Type</label>
                    <select 
                      value={kin.idType}
                      onChange={(e) => handleNextOfKinChange(index, 'idType', e.target.value)}
                    >
                      <option value="">Select ID Type</option>
                      {idTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>ID Number</label>
                    <input
                      type="text"
                      value={kin.idNumber}
                      onChange={(e) => handleNextOfKinChange(index, 'idNumber', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={kin.dateOfBirth}
                      onChange={(e) => handleNextOfKinChange(index, 'dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      value={kin.address}
                      onChange={(e) => handleNextOfKinChange(index, 'address', e.target.value)}
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={kin.phoneNo}
                      onChange={(e) => handleNextOfKinChange(index, 'phoneNo', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={kin.email}
                      onChange={(e) => handleNextOfKinChange(index, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="add-kin-section">
              <button type="button" onClick={addNextOfKin} className="add-kin-button">
                <i className="fas fa-plus"></i> Add Another Next of Kin
              </button>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="prev-button">
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </span>
                ) : (
                  <span>
                    <i className="fas fa-paper-plane"></i> Submit Application
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .membership-application-page {
          min-height: 100vh;
          background: #7A1F23;
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .application-container {
          max-width: 800px;
          width: 100%;
          background: #F5B800;
          border-radius: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .application-header {
          background: linear-gradient(to right, #7A1F23, #5a1519);
          color: white;
          padding: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
        }

        .logo-container {
          width: 4rem;
          height: 4rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F5B800;
        }

        .logo-container img {
          width: 70%;
          height: 70%;
          object-fit: contain;
        }

        .logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          display: none;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .header-text h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .header-text p {
          opacity: 0.9;
          color: #F5B800;
          margin: 0;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          padding: 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 1rem;
          left: 60%;
          right: -40%;
          height: 2px;
          background: #e2e8f0;
          z-index: 1;
        }

        .step.completed:not(:last-child)::after {
          background: #7A1F23;
        }

        .step-number {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .step.active .step-number {
          background: #7A1F23;
          color: white;
        }

        .step.completed .step-number {
          background: #16a34a;
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .step.active .step-label {
          color: #7A1F23;
          font-weight: 600;
        }

        .form-step {
          padding: 2rem;
          background: #F5B800;
        }

        .form-step h2 {
          color: #7A1F23;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          border-bottom: 2px solid #7A1F23;
          padding-bottom: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          font-weight: 600;
          color: #7A1F23;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #7A1F23;
          box-shadow: 0 0 0 3px rgba(122, 31, 35, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(122, 31, 35, 0.2);
        }

        .prev-button,
        .next-button,
        .submit-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .prev-button {
          background: #f3f4f6;
          color: #374151;
        }

        .prev-button:hover {
          background: #e5e7eb;
        }

        .next-button,
        .submit-button {
          background: #7A1F23;
          color: white;
        }

        .next-button:hover,
        .submit-button:hover:not(:disabled) {
          background: #5a1519;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .kin-section {
          background: rgba(255, 255, 255, 0.9);
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(122, 31, 35, 0.2);
        }

        .kin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .kin-header h3 {
          color: #7A1F23;
          font-size: 1.125rem;
        }

        .remove-kin-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .remove-kin-button:hover {
          background: #b91c1c;
        }

        .add-kin-section {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .add-kin-button {
          background: #059669;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-kin-button:hover {
          background: #047857;
        }

        .message {
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .success-message {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        @media (max-width: 768px) {
          .membership-application-page {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            padding: 1rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
          
          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .prev-button,
          .next-button,
          .submit-button {
            width: 100%;
            justify-content: center;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .membership-application-page {
            padding: 0.5rem;
          }
          
          .application-container {
            border-radius: 0.5rem;
          }
          
          .application-header {
            padding: 1.5rem 1rem;
          }
          
          .header-text h1 {
            font-size: 1.5rem;
          }
          
          .form-step {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OnlineMembershipApplication;