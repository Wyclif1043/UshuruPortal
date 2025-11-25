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

  // Get member account details
  getMemberAccountDetails: async (username) => {
    const response = await api.get(`/member-account-details/?username=${username}`);
    return response.data;
  },

  // Get member booked plots
  getMemberBookedPlots: async (memberNo) => {
    const response = await api.get(`/member-booked-plots/?memberNo=${memberNo}`);
    return response.data;
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

  // Create customer (removed duplicate)
  createCustomer: async (customerData) => {
    const response = await api.post('/create-customer/', customerData);
    return response.data;
  },

  // Customer book plot
  customerBookPlot: async (bookingData) => {
    const response = await api.post('/customer-book-plot/', bookingData);
    return response.data;
  },

  // Submit membership application (fixed syntax)
  submitMembershipApplication: async (applicationData) => {
    try {
      console.log('📝 Submitting membership application');
      const response = await api.post('/online-membership-application/', applicationData);
      console.log('✅ Membership application response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Membership application error:', error.response?.data || error.message);
      throw error;
    }
  }
};