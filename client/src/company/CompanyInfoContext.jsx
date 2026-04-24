import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api.js';

// Fallback used until the API responds (and as a safety net offline).
const FALLBACK = {
  _id: null,
  name: 'י.ש. מהנדסים בע״מ',
  nameEn: 'Y.SCH. Engineers Ltd',
  tagline: 'נגרות וחיפויים ברמה הגבוהה ביותר – מאז 2005',
  address: 'העמק 54, גבעת אלה',
  postal: '3657000',
  phone: '054-2201199',
  phoneDisplay: '054-220-1199',
  fax: '04-6415020',
  email: 'info@ys-engineers.co.il',
  hoursWeekdays: 'א׳–ה׳: 07:30–19:30',
  hoursFriday: 'ו׳: 09:00–13:00',
  founded: 2005,
  whatsapp: '',
};

function withLegacyHours(info) {
  return {
    ...info,
    hours: {
      weekdays: info.hoursWeekdays || '',
      friday: info.hoursFriday || '',
    },
  };
}

const INITIAL = withLegacyHours(FALLBACK);

const Ctx = createContext({
  info: INITIAL,
  loading: true,
  refresh: async () => {},
  update: async () => {},
});

export function CompanyInfoProvider({ children }) {
  const [info, setInfo] = useState(INITIAL);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { data } = await api.get('/company-info');
      setInfo(withLegacyHours({ ...FALLBACK, ...data }));
    } catch (_e) {
      // keep fallback
    } finally {
      setLoading(false);
    }
  }

  async function update(patch) {
    const { data } = await api.put('/company-info', patch);
    const merged = withLegacyHours({ ...FALLBACK, ...data });
    setInfo(merged);
    return merged;
  }

  useEffect(() => { refresh(); }, []);

  const value = useMemo(() => ({ info, loading, refresh, update }), [info, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompanyInfo() {
  return useContext(Ctx);
}

