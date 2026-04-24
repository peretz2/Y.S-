import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;

// Note: company info (phone, email, hours, etc.) moved to MongoDB.
// Use `useCompanyInfo()` from `client/src/company/CompanyInfoContext.jsx`.
