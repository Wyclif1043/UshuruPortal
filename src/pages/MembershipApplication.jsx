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
      nationality: '0', // 0 = Kenyan, 1 = Other
      city: '',
      town: '',
      identificationDocument: '1', // 1 = National ID, 2 = Passport, etc.
      identificationNo: '',
      passportNo: '',
      dateOfBirth: '',
      gender: '1', // 1 = Male, 2 = Female
      kRAPin: '',
      maritalStatus: '2', // 0 = Single, 1 = Married, 2 = Divorced, etc.
      physicalLocation: '',
      address: '',
      postalCode: '',
      mobilePhoneNo: '',
      personalEmail: '',
      employmentInfo: '1', // 1 = Employed, 2 = Self-employed, etc.
      employerCode: '',
      contributionMode: '0', // 0 = Monthly, 1 = Quarterly, etc.
      entranceFeeContribution: '',
      sharesContribution: '',
      investmentContribution: '',
      howdidyourhearaboutus: '2', // 1 = Social Media, 2 = Friend, 3 = TV/Radio, etc.
      payrollStaffNo: '',
      pictureBase64: '',
      idFrontBase64: '',
      idBackBase64: ''
    },
    nextOfKin: [],
    nominees: []
  });

  // Nationality options
  const nationalityOptions = [
    { value: '0', label: 'Kenyan' },
    { value: '1', label: 'Ugandan' },
    { value: '2', label: 'Tanzanian' },
    { value: '3', label: 'Rwandan' },
    { value: '4', label: 'Burundian' },
    { value: '5', label: 'South Sudanese' },
    { value: '6', label: 'Other' }
  ];

  // ID Document options
  const idDocumentOptions = [
    { value: '1', label: 'National ID Card' },
    { value: '2', label: 'Passport' },
    { value: '3', label: 'Driving License' },
    { value: '4', label: 'Alien ID' },
    { value: '5', label: 'Military ID' }
  ];

  // Gender options
  const genderOptions = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' }
  ];

  // Marital Status options
  const maritalStatusOptions = [
    { value: '0', label: 'Single' },
    { value: '1', label: 'Married' },
    { value: '2', label: 'Divorced' },
    { value: '3', label: 'Widowed' },
    { value: '4', label: 'Separated' }
  ];

  // Employment options
  const employmentOptions = [
    { value: '1', label: 'Employed' },
    { value: '2', label: 'Self-employed' },
    { value: '3', label: 'Business Owner' },
    { value: '4', label: 'Retired' },
    { value: '5', label: 'Student' },
    { value: '6', label: 'Unemployed' }
  ];

  // Employer Code options - NEW
  const employerCodeOptions = [
    { value: '', label: 'Select Employer (Optional)' },
    { value: 'KRA', label: 'KRA - Kenya Revenue Authority' },
    { value: 'KLB', label: 'KLB - Kenya Literature Bureau' },
    { value: 'PZCUSSONS', label: 'PZ Cussons' },
    { value: 'NHIF', label: 'NHIF - National Hospital Insurance Fund' },
    { value: 'NHC', label: 'NHC - National Housing Corporation' },
    { value: 'OTHER', label: 'Other Employer' }
  ];

  // Contribution Mode options
  const contributionModeOptions = [
    { value: '0', label: 'Monthly' },
    { value: '1', label: 'Quarterly' },
    { value: '2', label: 'Bi-Annually' },
    { value: '3', label: 'Annually' }
  ];

  // How did you hear about us options
  const hearAboutOptions = [
    { value: '0', label: 'Select Option' },
    { value: '1', label: 'Social Media' },
    { value: '2', label: 'Friend/Family' },
    { value: '3', label: 'TV/Radio' },
    { value: '4', label: 'Newspaper' },
    { value: '5', label: 'Billboard' },
    { value: '6', label: 'Workplace' },
    { value: '7', label: 'Other' }
  ];

  // Relationship options
  const relationshipOptions = [
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'CHILD', label: 'Child' },
    { value: 'PARENT', label: 'Parent' },
    { value: 'SIBLING', label: 'Sibling' },
    { value: 'GRANDPARENT', label: 'Grandparent' },
    { value: 'GRANDCHILD', label: 'Grandchild' },
    { value: 'AUNT', label: 'Aunt' },
    { value: 'UNCLE', label: 'Uncle' },
    { value: 'NIECE', label: 'Niece' },
    { value: 'NEPHEW', label: 'Nephew' },
    { value: 'COUSIN', label: 'Cousin' },
    { value: 'FRIEND', label: 'Friend' },
    { value: 'OTHER', label: 'Other' }
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

  const handleNomineeChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      nominees: prev.nominees.map((nominee, i) => 
        i === index ? { ...nominee, [name]: type === 'checkbox' ? checked : value } : nominee
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
          idType: 1,
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
    setFormData(prev => ({
      ...prev,
      nextOfKin: prev.nextOfKin.filter((_, i) => i !== index)
    }));
  };

  const addNominee = () => {
    setFormData(prev => ({
      ...prev,
      nominees: [
        ...prev.nominees,
        {
          name: '',
          idType: 1,
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

  const removeNominee = (index) => {
    setFormData(prev => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index)
    }));
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
            [field]: base64Data
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
    const { applicant, nextOfKin } = formData;
    
    switch (step) {
      case 1:
        if (!applicant.firstName || !applicant.lastName) {
          setMessage('Please fill in your full name');
          return false;
        }
        if (!applicant.identificationNo) {
          setMessage('Please enter your identification number');
          return false;
        }
        if (!applicant.dateOfBirth) {
          setMessage('Please enter your date of birth');
          return false;
        }
        if (!applicant.gender) {
          setMessage('Please select your gender');
          return false;
        }
        return true;
      
      case 2:
        if (!applicant.city || !applicant.town) {
          setMessage('Please enter your city and town');
          return false;
        }
        if (!applicant.physicalLocation) {
          setMessage('Please enter your physical location');
          return false;
        }
        if (!applicant.mobilePhoneNo) {
          setMessage('Please enter your mobile phone number');
          return false;
        }
        if (!applicant.personalEmail) {
          setMessage('Please enter your personal email');
          return false;
        }
        return true;
      
      case 3:
        if (!applicant.employmentInfo) {
          setMessage('Please select your employment status');
          return false;
        }
        if (!applicant.entranceFeeContribution) {
          setMessage('Please enter entrance fee contribution amount');
          return false;
        }
        if (!applicant.sharesContribution) {
          setMessage('Please enter shares contribution amount');
          return false;
        }
        return true;
      
      case 4:
        if (nextOfKin.length === 0) {
          setMessage('Please add at least one next of kin');
          return false;
        }
        const isValidKin = nextOfKin.every(kin => 
          kin.name && kin.relationshipCode && kin.phoneNo
        );
        if (!isValidKin) {
          setMessage('Please fill in all required next of kin information');
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

    const submissionData = {
      applicant: formData.applicant,
      nextOfKin: formData.nextOfKin,
      nominees: formData.nominees
    };

    try {
      const response = await authService.submitMembershipApplication(submissionData);
      
      if (response.status === 'success') {
        setApplicationSuccess(true);
        setMemberId(response.memberAppNo || response.memberId);
        setMessage('Membership application submitted successfully!');
        
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
                    <h3>Application Number</h3>
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
                      nationality: '0',
                      city: '',
                      town: '',
                      identificationDocument: '1',
                      identificationNo: '',
                      passportNo: '',
                      dateOfBirth: '',
                      gender: '1',
                      kRAPin: '',
                      maritalStatus: '2',
                      physicalLocation: '',
                      address: '',
                      postalCode: '',
                      mobilePhoneNo: '',
                      personalEmail: '',
                      employmentInfo: '1',
                      employerCode: '',
                      contributionMode: '0',
                      entranceFeeContribution: '',
                      sharesContribution: '',
                      investmentContribution: '',
                      howdidyourhearaboutus: '2',
                      payrollStaffNo: '',
                      pictureBase64: '',
                      idFrontBase64: '',
                      idBackBase64: ''
                    },
                    nextOfKin: [],
                    nominees: []
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
                  {step === 2 && 'Contact Details'}
                  {step === 3 && 'Employment & Contributions'}
                  {step === 4 && 'Next of Kin'}
                  {step === 5 && 'Nominees & Review'}
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
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.applicant.firstName}
                      onChange={handleApplicantChange}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.applicant.middleName}
                      onChange={handleApplicantChange}
                      placeholder="Enter middle name"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.applicant.lastName}
                      onChange={handleApplicantChange}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
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
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select 
                      name="gender" 
                      value={formData.applicant.gender} 
                      onChange={handleApplicantChange}
                      required
                    >
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marital Status</label>
                    <select 
                      name="maritalStatus" 
                      value={formData.applicant.maritalStatus} 
                      onChange={handleApplicantChange}
                    >
                      {maritalStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nationality *</label>
                    <select 
                      name="nationality" 
                      value={formData.applicant.nationality} 
                      onChange={handleApplicantChange}
                      required
                    >
                      {nationalityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>KRA PIN</label>
                    <input
                      type="text"
                      name="kRAPin"
                      value={formData.applicant.kRAPin}
                      onChange={handleApplicantChange}
                      placeholder="Enter KRA PIN"
                    />
                  </div>
                </div>

                <h3>Identification Documents</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>ID Type *</label>
                    <select 
                      name="identificationDocument" 
                      value={formData.applicant.identificationDocument} 
                      onChange={handleApplicantChange}
                      required
                    >
                      {idDocumentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ID Number *</label>
                    <input
                      type="text"
                      name="identificationNo"
                      value={formData.applicant.identificationNo}
                      onChange={handleApplicantChange}
                      required
                      placeholder="Enter ID number"
                    />
                  </div>
                </div>

                {formData.applicant.identificationDocument === '2' && (
                  <div className="form-group">
                    <label>Passport Number</label>
                    <input
                      type="text"
                      name="passportNo"
                      value={formData.applicant.passportNo}
                      onChange={handleApplicantChange}
                      placeholder="Enter passport number"
                    />
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label>Upload ID Front</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'idFrontBase64')}
                    />
                    <small>Max size: 2MB</small>
                  </div>
                  <div className="form-group">
                    <label>Upload ID Back</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'idBackBase64')}
                    />
                    <small>Max size: 2MB</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2>Contact Details</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.applicant.city}
                      onChange={handleApplicantChange}
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>Town *</label>
                    <input
                      type="text"
                      name="town"
                      value={formData.applicant.town}
                      onChange={handleApplicantChange}
                      required
                      placeholder="Enter town"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Physical Location *</label>
                  <textarea
                    name="physicalLocation"
                    value={formData.applicant.physicalLocation}
                    onChange={handleApplicantChange}
                    required
                    placeholder="Enter your physical location/landmark"
                    rows="3"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Postal Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.applicant.address}
                      onChange={handleApplicantChange}
                      placeholder="P.O Box"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.applicant.postalCode}
                      onChange={handleApplicantChange}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Mobile Phone Number *</label>
                    <input
                      type="tel"
                      name="mobilePhoneNo"
                      value={formData.applicant.mobilePhoneNo}
                      onChange={handleApplicantChange}
                      required
                      placeholder="0712345678"
                    />
                  </div>
                  <div className="form-group">
                    <label>Personal Email *</label>
                    <input
                      type="email"
                      name="personalEmail"
                      value={formData.applicant.personalEmail}
                      onChange={handleApplicantChange}
                      required
                      placeholder="john.doe@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>How did you hear about us? *</label>
                  <select 
                    name="howdidyourhearaboutus" 
                    value={formData.applicant.howdidyourhearaboutus} 
                    onChange={handleApplicantChange}
                    required
                  >
                    {hearAboutOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'pictureBase64')}
                  />
                  <small>Max size: 2MB</small>
                </div>
              </div>
            )}

            {/* Step 3: Employment & Contributions */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2>Employment & Contributions</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employment Status *</label>
                    <select 
                      name="employmentInfo" 
                      value={formData.applicant.employmentInfo} 
                      onChange={handleApplicantChange}
                      required
                    >
                      {employmentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Employer Code</label>
                    <select 
                      name="employerCode" 
                      value={formData.applicant.employerCode} 
                      onChange={handleApplicantChange}
                    >
                      {employerCodeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.applicant.employerCode === 'OTHER' && (
                  <div className="form-group">
                    <label>Other Employer Name</label>
                    <input
                      type="text"
                      name="employerCode"
                      value={formData.applicant.employerCode === 'OTHER' ? '' : formData.applicant.employerCode}
                      onChange={handleApplicantChange}
                      placeholder="Enter employer name"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Payroll Staff No.</label>
                  <input
                    type="text"
                    name="payrollStaffNo"
                    value={formData.applicant.payrollStaffNo}
                    onChange={handleApplicantChange}
                    placeholder="Enter payroll staff number"
                  />
                </div>

                <h3>Contribution Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contribution Mode *</label>
                    <select 
                      name="contributionMode" 
                      value={formData.applicant.contributionMode} 
                      onChange={handleApplicantChange}
                    >
                      {contributionModeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Entrance Fee (KES) *</label>
                    <input
                      type="number"
                      name="entranceFeeContribution"
                      value={formData.applicant.entranceFeeContribution}
                      onChange={handleApplicantChange}
                      required
                      placeholder="1000.00"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Shares Contribution (KES) *</label>
                    <input
                      type="number"
                      name="sharesContribution"
                      value={formData.applicant.sharesContribution}
                      onChange={handleApplicantChange}
                      required
                      placeholder="5000.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Investment Contribution (KES)</label>
                  <input
                    type="number"
                    name="investmentContribution"
                    value={formData.applicant.investmentContribution}
                    onChange={handleApplicantChange}
                    placeholder="2000.00"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Next of Kin */}
            {currentStep === 4 && (
              <div className="form-step">
                <h2>Next of Kin</h2>
                <p className="section-description">Please add at least one next of kin</p>

                {formData.nextOfKin.map((kin, index) => (
                  <div key={index} className="person-section">
                    <div className="section-header">
                      <h3>Next of Kin {index + 1}</h3>
                      {formData.nextOfKin.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNextOfKin(index)}
                          className="remove-button"
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={kin.name}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          required
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Relationship *</label>
                        <select
                          name="relationshipCode"
                          value={kin.relationshipCode}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          required
                        >
                          <option value="">Select Relationship</option>
                          {relationshipOptions.map(rel => (
                            <option key={rel.value} value={rel.value}>
                              {rel.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>ID Type</label>
                        <select
                          name="idType"
                          value={kin.idType}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                        >
                          <option value="1">National ID</option>
                          <option value="2">Passport</option>
                          <option value="3">Driving License</option>
                          <option value="4">Alien ID</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>ID Number</label>
                        <input
                          type="text"
                          name="idNumber"
                          value={kin.idNumber}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          placeholder="Enter ID number"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={kin.dob}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          name="phoneNo"
                          value={kin.phoneNo}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          required
                          placeholder="0712345678"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={kin.email}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          placeholder="kin@email.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          value={kin.address}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                          placeholder="Physical address"
                        />
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isBeneficiary"
                          checked={kin.isBeneficiary}
                          onChange={(e) => handleNextOfKinChange(index, e)}
                        />
                        This person is a beneficiary
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNextOfKin}
                  className="add-button"
                >
                  <i className="fas fa-plus"></i> Add Next of Kin
                </button>
              </div>
            )}

            {/* Step 5: Nominees & Review */}
            {currentStep === 5 && (
              <div className="form-step">
                <h2>Nominees & Review</h2>
                
                <h3>Nominees (Optional)</h3>
                <p className="section-description">Add beneficiaries/nominees for your investments</p>

                {formData.nominees.map((nominee, index) => (
                  <div key={index} className="person-section">
                    <div className="section-header">
                      <h4>Nominee {index + 1}</h4>
                      {formData.nominees.length > 0 && (
                        <button
                          type="button"
                          onClick={() => removeNominee(index)}
                          className="remove-button"
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={nominee.name}
                          onChange={(e) => handleNomineeChange(index, e)}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Relationship</label>
                        <select
                          name="relationshipCode"
                          value={nominee.relationshipCode}
                          onChange={(e) => handleNomineeChange(index, e)}
                        >
                          <option value="">Select Relationship</option>
                          {relationshipOptions.map(rel => (
                            <option key={rel.value} value={rel.value}>
                              {rel.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>ID Number</label>
                        <input
                          type="text"
                          name="idNumber"
                          value={nominee.idNumber}
                          onChange={(e) => handleNomineeChange(index, e)}
                          placeholder="Enter ID number"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNo"
                          value={nominee.phoneNo}
                          onChange={(e) => handleNomineeChange(index, e)}
                          placeholder="0712345678"
                        />
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isBeneficiary"
                          checked={nominee.isBeneficiary}
                          onChange={(e) => handleNomineeChange(index, e)}
                        />
                        This person is a beneficiary
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNominee}
                  className="add-button"
                >
                  <i className="fas fa-plus"></i> Add Nominee
                </button>

                <h3>Review Your Application</h3>
                
                <div className="review-section">
                  <h4>Personal Information</h4>
                  <div className="review-summary">
                    <p><strong>Name:</strong> {formData.applicant.firstName} {formData.applicant.middleName} {formData.applicant.lastName}</p>
                    <p><strong>Date of Birth:</strong> {formData.applicant.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {genderOptions.find(g => g.value === formData.applicant.gender)?.label}</p>
                    <p><strong>Marital Status:</strong> {maritalStatusOptions.find(m => m.value === formData.applicant.maritalStatus)?.label}</p>
                    <p><strong>Nationality:</strong> {nationalityOptions.find(n => n.value === formData.applicant.nationality)?.label}</p>
                    <p><strong>ID Type:</strong> {idDocumentOptions.find(i => i.value === formData.applicant.identificationDocument)?.label}</p>
                    <p><strong>ID Number:</strong> {formData.applicant.identificationNo}</p>
                    {formData.applicant.kRAPin && <p><strong>KRA PIN:</strong> {formData.applicant.kRAPin}</p>}
                  </div>
                </div>

                <div className="review-section">
                  <h4>Contact Information</h4>
                  <div className="review-summary">
                    <p><strong>City:</strong> {formData.applicant.city}</p>
                    <p><strong>Town:</strong> {formData.applicant.town}</p>
                    <p><strong>Physical Location:</strong> {formData.applicant.physicalLocation}</p>
                    {formData.applicant.address && <p><strong>Postal Address:</strong> {formData.applicant.address}, {formData.applicant.postalCode}</p>}
                    <p><strong>Mobile Phone:</strong> {formData.applicant.mobilePhoneNo}</p>
                    <p><strong>Email:</strong> {formData.applicant.personalEmail}</p>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Employment & Contributions</h4>
                  <div className="review-summary">
                    <p><strong>Employment Status:</strong> {employmentOptions.find(e => e.value === formData.applicant.employmentInfo)?.label}</p>
                    {formData.applicant.employerCode && <p><strong>Employer:</strong> {employerCodeOptions.find(e => e.value === formData.applicant.employerCode)?.label || formData.applicant.employerCode}</p>}
                    {formData.applicant.payrollStaffNo && <p><strong>Payroll Staff No:</strong> {formData.applicant.payrollStaffNo}</p>}
                    <p><strong>Contribution Mode:</strong> {contributionModeOptions.find(c => c.value === formData.applicant.contributionMode)?.label}</p>
                    <p><strong>Entrance Fee:</strong> KES {formData.applicant.entranceFeeContribution}</p>
                    <p><strong>Shares Contribution:</strong> KES {formData.applicant.sharesContribution}</p>
                    {formData.applicant.investmentContribution && <p><strong>Investment Contribution:</strong> KES {formData.applicant.investmentContribution}</p>}
                  </div>
                </div>

                {formData.nextOfKin.length > 0 && (
                  <div className="review-section">
                    <h4>Next of Kin</h4>
                    {formData.nextOfKin.map((kin, index) => (
                      <div key={index} className="review-subsection">
                        <h5>Kin {index + 1}: {kin.name}</h5>
                        <p><strong>Relationship:</strong> {relationshipOptions.find(r => r.value === kin.relationshipCode)?.label}</p>
                        <p><strong>Phone:</strong> {kin.phoneNo}</p>
                        {kin.email && <p><strong>Email:</strong> {kin.email}</p>}
                        <p><strong>Beneficiary:</strong> {kin.isBeneficiary ? 'Yes' : 'No'}</p>
                      </div>
                    ))}
                  </div>
                )}

                {formData.nominees.length > 0 && (
                  <div className="review-section">
                    <h4>Nominees</h4>
                    {formData.nominees.map((nominee, index) => (
                      <div key={index} className="review-subsection">
                        <h5>Nominee {index + 1}: {nominee.name}</h5>
                        <p><strong>Relationship:</strong> {relationshipOptions.find(r => r.value === nominee.relationshipCode)?.label}</p>
                        <p><strong>Phone:</strong> {nominee.phoneNo}</p>
                        <p><strong>Beneficiary:</strong> {nominee.isBeneficiary ? 'Yes' : 'No'}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-group checkbox-group declaration">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>I hereby declare that all the information provided is true and correct to the best of my knowledge. I agree to abide by the by-laws and regulations of Ushuru Investment Co-operative Society.</span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="nav-button prev-button">
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              
              {currentStep < 5 ? (
                <button type="button" onClick={nextStep} className="nav-button next-button">
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Application
                    </>
                  )}
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

          .form-step h3 {
            color: #374151;
            margin: 2rem 0 1rem 0;
            font-size: 1.25rem;
          }

          .section-description {
            color: #6b7280;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
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

          .form-group small {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
          }

          /* Person Section (Next of Kin / Nominees) */
          .person-section {
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

          .section-header h3,
          .section-header h4 {
            color: #7A1F23;
            margin: 0;
            font-size: 1.125rem;
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
            display: flex;
            align-items: center;
            gap: 0.5rem;
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

          .add-button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-bottom: 2rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .add-button:hover {
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

          .review-section h4 {
            color: #0369a1;
            margin-bottom: 1rem;
            font-size: 1.125rem;
          }

          .review-summary p {
            margin: 0.5rem 0;
            color: #374151;
          }

          .review-subsection {
            background-color: white;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-top: 1rem;
          }

          .review-subsection h5 {
            color: #7A1F23;
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
          }

          .declaration {
            margin-top: 2rem;
            padding: 1rem;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 0.5rem;
          }

          /* Message */
          .message {
            padding: 1rem;
            margin: 1rem 2rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
          }

          .message.error {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            color: #dc2626;
          }

          .message.success {
            background-color: #f0fdf4;
            border: 1px solid #dcfce7;
            color: #16a34a;
          }

          /* Navigation */
          .form-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e9ecef;
          }

          .nav-button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .prev-button {
            background-color: #6c757d;
            color: white;
          }

          .prev-button:hover {
            background-color: #5a6268;
          }

          .next-button {
            background-color: #7A1F23;
            color: white;
            margin-left: auto;
          }

          .next-button:hover {
            background-color: #5a1519;
          }

          .submit-button {
            background-color: #28a745;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-left: auto;
          }

          .submit-button:hover:not(:disabled) {
            background-color: #218838;
          }

          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          /* Success Page Styles */
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
          }

          .success-header {
            margin-bottom: 2rem;
          }

          .success-icon {
            font-size: 4rem;
            color: #28a745;
            margin-bottom: 1rem;
          }

          .success-container h1 {
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 2.5rem;
            font-weight: 700;
          }

          .success-message {
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 2rem;
          }

          .reference-card {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 2px solid #bae6fd;
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
          }

          .reference-number {
            font-size: 2rem;
            font-weight: 700;
            color: #7A1F23;
            font-family: 'Courier New', monospace;
            margin-top: 0.5rem;
          }

          .next-steps h2 {
            color: #2d3748;
            margin-bottom: 1.5rem;
          }

          .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .step-item {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 0.75rem;
            text-align: center;
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

          .auto-redirect {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-top: 1.5rem;
            color: #856404;
          }

          .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
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
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .primary-button {
            background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
            color: white;
          }

          .secondary-button {
            background: white;
            color: #374151;
            border: 2px solid #d1d5db;
          }

          .secondary-button:hover {
            background: #f9fafb;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }

            .progress-bar {
              padding: 1rem;
            }

            .step-label {
              display: none;
            }

            .success-container {
              padding: 2rem 1.5rem;
            }

            .success-container h1 {
              font-size: 2rem;
            }

            .steps-grid {
              grid-template-columns: 1fr;
            }

            .success-actions {
              flex-direction: column;
            }
          }

          @media (max-width: 480px) {
            .application-header h1 {
              font-size: 1.5rem;
            }

            .application-form {
              padding: 1.5rem;
            }

            .form-navigation {
              flex-direction: column;
              gap: 1rem;
            }

            .nav-button,
            .submit-button {
              width: 100%;
              justify-content: center;
            }

            .next-button,
            .submit-button {
              margin-left: 0;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
};

export default MembershipApplication;