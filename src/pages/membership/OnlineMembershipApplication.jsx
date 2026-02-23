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
    nationality: '0', // 0 = Kenyan, 1 = Non-Kenyan
    city: 'Nairobi',
    town: '',
    identificationDocument: '1', // 1 = ID Number, 2 = Passport
    identificationNo: '',
    passportNo: '',
    dateOfBirth: '',
    gender: '1', // 1 = Male, 2 = Female
    kRAPin: '',
    maritalStatus: '1', // 1 = Single, 2 = Married, 3 = Divorced, 4 = Widower, 5 = Widow
    
    // Contact Information
    physicalLocation: '',
    address: '',
    postalCode: '',
    mobilePhoneNo: '',
    personalEmail: '',
    
    // Employment Information
    employmentInfo: '1', // 1 = Employed, 2 = Self Employed
    employerCode: '',
    
    // Contribution Information
    contributionMode: '0', // 0 = Check off, 1 = Back Office Receipt, 2 = Standing Order
    entranceFeeContribution: '1000.00',
    sharesContribution: '5000.00',
    investmentContribution: '0.00',
    howdidyourhearaboutus: '1', // 1 = Staff, 2 = Member, 3 = Social Media, 4 = Other
    
    // Payroll Information
    payrollStaffNo: '',
    
    // Files (Base64)
    pictureBase64: '',
    idFrontBase64: '',
    idBackBase64: '',
    
    // Next of Kin
    nextOfKin: [{
      name: '',
      idType: '1',
      idNumber: '',
      dob: '',
      address: '',
      phoneNo: '',
      email: '',
      relationshipCode: '',
      isBeneficiary: true
    }],
    
    // Nominees (same structure as next of kin but separate)
    nominees: [{
      name: '',
      idType: '1',
      idNumber: '',
      dob: '',
      address: '',
      phoneNo: '',
      email: '',
      relationshipCode: '',
      isBeneficiary: true
    }]
  });

  const navigate = useNavigate();

  // Enum mappings based on your SOAP documentation
  const nationalityOptions = [
    { value: '0', label: 'Kenyan' },
    { value: '1', label: 'Non-Kenyan' }
  ];

  const identificationDocumentOptions = [
    { value: '1', label: 'ID Number' },
    { value: '2', label: 'Passport No' },
    { value: '3', label: 'Service Number' },
    { value: '4', label: 'Birth Certificate Number' },
    { value: '5', label: 'Huduma/Maisha Number' },
    { value: '6', label: 'System UID' }
  ];

  const genderOptions = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' }
  ];

  const maritalStatusOptions = [
    { value: '1', label: 'Single' },
    { value: '2', label: 'Married' },
    { value: '3', label: 'Divorced' },
    { value: '4', label: 'Widower' },
    { value: '5', label: 'Widow' }
  ];

  const employmentInfoOptions = [
    { value: '1', label: 'Employed' },
    { value: '2', label: 'Self Employed' }
  ];

  const contributionModeOptions = [
    { value: '0', label: 'Check off' },
    { value: '1', label: 'Back Office Receipt' },
    { value: '2', label: 'Standing Order' }
  ];

  const referralSourceOptions = [
    { value: '1', label: 'Staff' },
    { value: '2', label: 'Member' },
    { value: '3', label: 'Social Media' },
    { value: '4', label: 'Other' }
  ];

  const relationshipOptions = [
    { value: 'SP', label: 'Spouse' },
    { value: 'CH', label: 'Child' },
    { value: 'PR', label: 'Parent' },
    { value: 'SB', label: 'Sibling' },
    { value: 'FR', label: 'Friend' },
    { value: 'OT', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      // Handle file uploads and convert to base64
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
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

  const handleNomineeChange = (index, field, value) => {
    const updatedNominees = [...formData.nominees];
    updatedNominees[index][field] = value;
    setFormData(prev => ({
      ...prev,
      nominees: updatedNominees
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
          dob: '',
          address: '',
          phoneNo: '',
          email: '',
          relationshipCode: '',
          isBeneficiary: true
        }
      ]
    }));
  };

  const addNominee = () => {
    setFormData(prev => ({
      ...prev,
      nominees: [
        ...prev.nominees,
        {
          name: '',
          idType: '1',
          idNumber: '',
          dob: '',
          address: '',
          phoneNo: '',
          email: '',
          relationshipCode: '',
          isBeneficiary: true
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

  const removeNominee = (index) => {
    if (formData.nominees.length > 1) {
      const updatedNominees = formData.nominees.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        nominees: updatedNominees
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.identificationNo ||
            !formData.dateOfBirth || !formData.gender || !formData.maritalStatus) {
          setMessage('Please fill in all required personal information fields');
          setMessageType('error');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.address || !formData.mobilePhoneNo || !formData.personalEmail) {
          setMessage('Please fill in all required contact information');
          setMessageType('error');
          return false;
        }
        return true;
      
      case 3:
        // Employment and contribution info are not strictly required
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

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Prepare the application data matching the SOAP structure
      const applicationData = {
        applicant: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          nationality: parseInt(formData.nationality) || 0,
          city: formData.city || 'Nairobi',
          town: formData.town || formData.city || 'Nairobi',
          identificationDocument: formData.identificationDocument,
          identificationNo: formData.identificationNo,
          passportNo: formData.passportNo || '',
          dateOfBirth: formData.dateOfBirth,
          gender: parseInt(formData.gender) || 1,
          kRAPin: formData.kRAPin || '',
          maritalStatus: parseInt(formData.maritalStatus) || 1,
          physicalLocation: formData.physicalLocation || formData.address,
          address: formData.address,
          postalCode: formData.postalCode || '',
          mobilePhoneNo: formData.mobilePhoneNo,
          personalEmail: formData.personalEmail,
          employmentInfo: parseInt(formData.employmentInfo) || 1,
          employerCode: formData.employerCode || '',
          contributionMode: parseInt(formData.contributionMode) || 0,
          entranceFeeContribution: parseFloat(formData.entranceFeeContribution) || 1000.00,
          sharesContribution: parseFloat(formData.sharesContribution) || 5000.00,
          investmentContribution: parseFloat(formData.investmentContribution) || 0.00,
          howdidyourhearaboutus: parseInt(formData.howdidyourhearaboutus) || 1,
          payrollStaffNo: formData.payrollStaffNo || '',
          pictureBase64: formData.pictureBase64 || '',
          idFrontBase64: formData.idFrontBase64 || '',
          idBackBase64: formData.idBackBase64 || ''
        },
        nextOfKin: formData.nextOfKin.map(kin => ({
          name: kin.name,
          idType: parseInt(kin.idType) || 1,
          idNumber: kin.idNumber,
          dob: kin.dob || '',
          address: kin.address || '',
          phoneNo: kin.phoneNo || '',
          email: kin.email || '',
          relationshipCode: kin.relationshipCode || '',
          isBeneficiary: kin.isBeneficiary !== false
        })),
        nominees: formData.nominees.map(nominee => ({
          name: nominee.name,
          idType: parseInt(nominee.idType) || 1,
          idNumber: nominee.idNumber,
          dob: nominee.dob || '',
          address: nominee.address || '',
          phoneNo: nominee.phoneNo || '',
          email: nominee.email || '',
          relationshipCode: nominee.relationshipCode || '',
          isBeneficiary: nominee.isBeneficiary !== false
        }))
      };

      console.log('Submitting application data:', {
        ...applicationData,
        applicant: {
          ...applicationData.applicant,
          pictureBase64: applicationData.applicant.pictureBase64 ? '[BASE64_DATA]' : '',
          idFrontBase64: applicationData.applicant.idFrontBase64 ? '[BASE64_DATA]' : '',
          idBackBase64: applicationData.applicant.idBackBase64 ? '[BASE64_DATA]' : ''
        }
      });

      // Update the endpoint to match your backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/membership/apply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok && result.status === 'success') {
        setMessage(`Application submitted successfully! Your application number is: ${result.memberAppNo}`);
        setMessageType('success');
        
        // Redirect to success page or login after 5 seconds
        setTimeout(() => {
          navigate(`/application-success/${result.memberAppNo}`);
        }, 5000);
      } else {
        setMessage(result.message || result.details || 'Application submission failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
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
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Personal Info'}
                {step === 2 && 'Contact Info'}
                {step === 3 && 'Employment'}
                {step === 4 && 'Next of Kin'}
                {step === 5 && 'Nominees'}
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
                <label>Nationality *</label>
                <select 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleInputChange}
                  required
                >
                  {nationalityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Town/Location</label>
                <input
                  type="text"
                  name="town"
                  value={formData.town}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>ID Type *</label>
                <select 
                  name="identificationDocument" 
                  value={formData.identificationDocument} 
                  onChange={handleInputChange}
                  required
                >
                  {identificationDocumentOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ID/Passport Number *</label>
                <input
                  type="text"
                  name="identificationNo"
                  value={formData.identificationNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {formData.identificationDocument === '2' && (
                <div className="form-group">
                  <label>Passport Number</label>
                  <input
                    type="text"
                    name="passportNo"
                    value={formData.passportNo}
                    onChange={handleInputChange}
                  />
                </div>
              )}

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

              <div className="form-group">
                <label>Gender *</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  required
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>KRA PIN</label>
                <input
                  type="text"
                  name="kRAPin"
                  value={formData.kRAPin}
                  onChange={handleInputChange}
                  placeholder="A123456789X"
                />
              </div>

              <div className="form-group">
                <label>Marital Status *</label>
                <select 
                  name="maritalStatus" 
                  value={formData.maritalStatus} 
                  onChange={handleInputChange}
                  required
                >
                  {maritalStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={nextStep} className="next-button">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Physical Location</label>
                <input
                  type="text"
                  name="physicalLocation"
                  value={formData.physicalLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Westlands, Nairobi"
                />
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Full physical address including street"
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile Phone *</label>
                <input
                  type="tel"
                  name="mobilePhoneNo"
                  value={formData.mobilePhoneNo}
                  onChange={handleInputChange}
                  required
                  placeholder="254712345678"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
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

        {/* Step 3: Employment & Contribution */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Employment & Contribution Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Employment Status</label>
                <select 
                  name="employmentInfo" 
                  value={formData.employmentInfo} 
                  onChange={handleInputChange}
                >
                  {employmentInfoOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Employer Code</label>
                <input
                  type="text"
                  name="employerCode"
                  value={formData.employerCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Contribution Mode</label>
                <select 
                  name="contributionMode" 
                  value={formData.contributionMode} 
                  onChange={handleInputChange}
                >
                  {contributionModeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Entrance Fee</label>
                <input
                  type="number"
                  name="entranceFeeContribution"
                  value={formData.entranceFeeContribution}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Shares Contribution</label>
                <input
                  type="number"
                  name="sharesContribution"
                  value={formData.sharesContribution}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Investment Contribution</label>
                <input
                  type="number"
                  name="investmentContribution"
                  value={formData.investmentContribution}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>How did you hear about us?</label>
                <select 
                  name="howdidyourhearaboutus" 
                  value={formData.howdidyourhearaboutus} 
                  onChange={handleInputChange}
                >
                  {referralSourceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
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
                <label>Profile Picture</label>
                <input
                  type="file"
                  name="pictureBase64"
                  onChange={handleInputChange}
                  accept="image/*"
                />
              </div>

              <div className="form-group">
                <label>ID Front Image</label>
                <input
                  type="file"
                  name="idFrontBase64"
                  onChange={handleInputChange}
                  accept="image/*"
                />
              </div>

              <div className="form-group">
                <label>ID Back Image</label>
                <input
                  type="file"
                  name="idBackBase64"
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

        {/* Step 4: Next of Kin */}
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
                      {identificationDocumentOptions.map(option => (
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
                      value={kin.dob}
                      onChange={(e) => handleNextOfKinChange(index, 'dob', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Relationship</label>
                    <select 
                      value={kin.relationshipCode}
                      onChange={(e) => handleNextOfKinChange(index, 'relationshipCode', e.target.value)}
                    >
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Is Beneficiary?</label>
                    <select 
                      value={kin.isBeneficiary}
                      onChange={(e) => handleNextOfKinChange(index, 'isBeneficiary', e.target.value === 'true')}
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
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
              <button type="button" onClick={nextStep} className="next-button">
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Nominees */}
        {currentStep === 5 && (
          <div className="form-step">
            <h2>Nominee Information</h2>
            
            {formData.nominees.map((nominee, index) => (
              <div key={index} className="kin-section">
                <div className="kin-header">
                  <h3>Nominee {index + 1}</h3>
                  {formData.nominees.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeNominee(index)}
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
                      value={nominee.name}
                      onChange={(e) => handleNomineeChange(index, 'name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>ID Type</label>
                    <select 
                      value={nominee.idType}
                      onChange={(e) => handleNomineeChange(index, 'idType', e.target.value)}
                    >
                      {identificationDocumentOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>ID Number</label>
                    <input
                      type="text"
                      value={nominee.idNumber}
                      onChange={(e) => handleNomineeChange(index, 'idNumber', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={nominee.dob}
                      onChange={(e) => handleNomineeChange(index, 'dob', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Relationship</label>
                    <select 
                      value={nominee.relationshipCode}
                      onChange={(e) => handleNomineeChange(index, 'relationshipCode', e.target.value)}
                    >
                      <option value="">Select Relationship</option>
                      {relationshipOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Is Beneficiary?</label>
                    <select 
                      value={nominee.isBeneficiary}
                      onChange={(e) => handleNomineeChange(index, 'isBeneficiary', e.target.value === 'true')}
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      value={nominee.address}
                      onChange={(e) => handleNomineeChange(index, 'address', e.target.value)}
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={nominee.phoneNo}
                      onChange={(e) => handleNomineeChange(index, 'phoneNo', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={nominee.email}
                      onChange={(e) => handleNomineeChange(index, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="add-kin-section">
              <button type="button" onClick={addNominee} className="add-kin-button">
                <i className="fas fa-plus"></i> Add Another Nominee
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
          max-width: 900px;
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
          max-height: 70vh;
          overflow-y: auto;
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
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
            max-height: none;
            overflow-y: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default OnlineMembershipApplication;