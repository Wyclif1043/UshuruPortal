// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    memberNumber: null,
    generatedOTP: '',
    isLoading: false,
    requiresOTP: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    profile: null,
    nextOfKin: [],
    nominees: [],
    profileLoading: false,
    profileError: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.memberNumber = action.payload.member_number;
      state.generatedOTP = action.payload.generatedOTP || '';
      state.requiresOTP = action.payload.requires_otp;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.requiresOTP = false;
    },
    otpVerificationStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.isLoading = false;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      state.requiresOTP = false;
      state.error = null;
    },
    otpVerificationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    profileLoadStart: (state) => {
      state.profileLoading = true;
      state.profileError = null;
    },
    profileLoadSuccess: (state, action) => {
      state.profileLoading = false;
      state.profile = action.payload.profile;
      state.nextOfKin = action.payload.next_of_kin;
      state.nominees = action.payload.nominees;
      state.profileError = null;
    },
    profileLoadFailure: (state, action) => {
      state.profileLoading = false;
      state.profileError = action.payload;
    },
    logout: (state) => {
      state.memberNumber = null;
      state.isLoading = false;
      state.requiresOTP = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.profile = null;
      state.nextOfKin = [];
      state.nominees = [];
      state.profileLoading = false;
      state.profileError = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  otpVerificationStart,
  otpVerificationSuccess,
  otpVerificationFailure,
  profileLoadStart,
  profileLoadSuccess,
  profileLoadFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;