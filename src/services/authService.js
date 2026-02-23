// services/authService.js
import api from './api';

export const authService = {
  // Login member
  loginMember: async (credentials) => {
    const response = await api.post('/login-member/', credentials);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post('/confirm-otp/', otpData);
    return response.data;
  },

  logout: () => {
    console.log('🚪 Logging out user');
    localStorage.removeItem('username');
  },

  register: async (memberData) => {
    try {
      console.log('📝 Registering new member');
      const response = await api.post('/register-member/', memberData);
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Change password/PIN
  changePassword: async (passwordData) => {
    try {
      console.log('🔐 Changing password');
      const response = await api.post('/change-password/', passwordData);
      console.log('✅ Password change response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Password change error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get member profile
  getMemberProfile: async (username) => {
    const response = await api.get(`/member-profile/?username=${username}`);
    return response.data;
  },

  // Get member account statistics (NEW METHOD)
  getMemberAccountStatistics: async (username) => {
    try {
      console.log('📊 Getting member account statistics');
      const response = await api.get(`/member-account-statistics/?username=${username}`);
      console.log('✅ Account statistics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Account statistics error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get member account details
  getMemberAccountDetails: async (username) => {
    const response = await api.get(`/member-account-details/?username=${username}`);
    return response.data;
  },

  // Get member booked plots
  getMemberBookedPlots: async (memberNo) => {
    try {
      console.log('🔵 [authService] Fetching plots for memberNo:', memberNo);
      const response = await api.get(`/member-booked-plots/?memberNo=${memberNo}`);
      console.log('🔵 [authService] Raw API Response:', response);
      console.log('🔵 [authService] Response data:', response.data);
      console.log('🔵 [authService] all_entries length:', response.data?.data?.all_entries?.length);
      return response.data;
    } catch (error) {
      console.error('❌ [authService] Error fetching booked plots:', error);
      console.error('❌ [authService] Error response:', error.response?.data);
      throw error;
    }
  },

  // Get land list
  getLandList: async () => {
    const response = await api.get('/get-land-list/');
    return response.data;
  },

  // Get plots by land
  getPlotsByLand: async (landCode) => {
    const response = await api.post('/get-plots-by-land/', { landCode });
    return response.data;
  },

  // Book plot
  bookPlot: async (bookingData) => {
    const response = await api.post('/book-plot/', bookingData);
    return response.data;
  },

  // services/authService.js - Add these methods

// Initiate STK Push
initiateSTKPush: async (paymentData) => {
  try {
    console.log('💰 Initiating STK Push:', paymentData);
    const response = await api.post('/mpesa-stk-push/', paymentData);
    console.log('✅ STK Push response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ STK Push error:', error.response?.data || error.message);
    throw error;
  }
},

processGeneralReceipt: async (paymentData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/general-receipts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing general receipt:', error);
    throw error;
  }
},

// Check payment status
checkPaymentStatus: async (bookingNo, phoneNumber) => {
  try {
    console.log('🔄 Checking payment status for:', { bookingNo, phoneNumber });
    const response = await api.get(`/mpesa-payment-status/?bookingNo=${bookingNo}&phoneNumber=${phoneNumber}`);
    console.log('✅ Payment status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Payment status check error:', error.response?.data || error.message);
    throw error;
  }
},

  // Create customer
  createCustomer: async (customerData) => {
    const response = await api.post('/create-customer/', customerData);
    return response.data;
  },

  // Customer book plot
  customerBookPlot: async (bookingData) => {
    const response = await api.post('/customer-book-plot/', bookingData);
    return response.data;
  },

  // Submit membership application (UPDATED for new SOAP API)
  submitMembershipApplication: async (applicationData) => {
    try {
      console.log('📝 Submitting membership application to new SOAP API');
      console.log('📤 Application data structure:', {
        applicant: Object.keys(applicationData.applicant || {}),
        nextOfKinCount: applicationData.nextOfKin?.length || 0,
        nomineesCount: applicationData.nominees?.length || 0
      });
      
      // Log sample data for debugging
      if (applicationData.applicant) {
        const sampleData = {
          firstName: applicationData.applicant.firstName,
          identificationNo: applicationData.applicant.identificationNo,
          gender: applicationData.applicant.gender,
          nationality: applicationData.applicant.nationality,
          contributionMode: applicationData.applicant.contributionMode
        };
        console.log('📋 Sample applicant data:', sampleData);
      }
      
      const response = await api.post('/online-membership-application/', applicationData);
      console.log('✅ Membership application response:', response.data);
      
      // Add validation for response structure
      if (response.data.status === 'success') {
        console.log('🎉 Application successful! Member App No:', response.data.memberAppNo);
      } else {
        console.warn('⚠️ Application response indicates issues:', response.data.message);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Membership application error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // Provide more helpful error messages
      if (error.response?.data) {
        throw new Error(error.response.data.message || error.response.data.details || 'Application failed');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw error;
      }
    }
  }
  
};