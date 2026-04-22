import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ys_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ys_token');
    }
    return Promise.reject(err);
  }
);

export default api;

export const companyInfo = {
  name: 'י.ש. מהנדסים בע״מ',
  nameEn: 'Y.SCH. Engineers Ltd',
  tagline: 'נגרות וחיפויים ברמה הגבוהה ביותר – מאז 2005',
  address: 'העמק 54, גבעת אלה',
  postal: '3657000',
  phone: '054-2201199',
  phoneDisplay: '054-220-1199',
  fax: '04-6415020',
  email: 'info@ys-engineers.co.il',
  hours: {
    weekdays: 'א׳–ה׳: 07:30–19:30',
    friday: 'ו׳: 09:00–13:00',
  },
  founded: 2005,
};
