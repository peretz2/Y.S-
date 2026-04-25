export const registry = [
  { key: 'nav.home',     defaultValue: 'בית',       section: 'nav', label: 'ניווט – בית',         multiline: false },
  { key: 'nav.about',    defaultValue: 'אודות',      section: 'nav', label: 'ניווט – אודות',        multiline: false },
  { key: 'nav.services', defaultValue: 'שירותים',    section: 'nav', label: 'ניווט – שירותים',      multiline: false },
  { key: 'nav.projects', defaultValue: 'פרויקטים',   section: 'nav', label: 'ניווט – פרויקטים',     multiline: false },
  { key: 'nav.contact',  defaultValue: 'צור קשר',    section: 'nav', label: 'ניווט – צור קשר',      multiline: false },

  // footer
  { key: 'footer.tagline',    defaultValue: 'נגרות וחיפויים בגובה העיניים',  section: 'footer', label: 'פוטר - סלוגן',          multiline: false },
  { key: 'footer.quickLinks', defaultValue: 'ניווט',                         section: 'footer', label: 'פוטר - כותרת ניווט',     multiline: false },
  { key: 'footer.contact',    defaultValue: 'יצירת קשר',                     section: 'footer', label: 'פוטר - כותרת יצירת קשר', multiline: false },
  { key: 'footer.rights',     defaultValue: 'כל הזכויות שמורות',             section: 'footer', label: 'פוטר - זכויות',           multiline: false },
  { key: 'footer.terms',      defaultValue: 'תנאי שימוש',                    section: 'footer', label: 'פוטר - תנאי שימוש',       multiline: false },
  { key: 'footer.privacy',    defaultValue: 'פרטיות',                        section: 'footer', label: 'פוטר - פרטיות',           multiline: false },
  { key: 'footer.accessibility', defaultValue: 'נגישות',                     section: 'footer', label: 'פוטר - נגישות',           multiline: false },

  // home hero
  { key: 'home.hero.eyebrow',       defaultValue: 'Y.SCH. Engineers · גבעת אלה',                                                                                                                                                                    section: 'home', label: 'הום - eyebrow',           multiline: false },
  { key: 'home.hero.title.1',       defaultValue: 'נגרות',                                                                                                                                                                                           section: 'home', label: 'הום - כותרת שורה 1',      multiline: false },
  { key: 'home.hero.title.2',       defaultValue: 'וחיפויים.',                                                                                                                                                                                        section: 'home', label: 'הום - כותרת שורה 2',      multiline: false },
  { key: 'home.hero.title.3',       defaultValue: 'בגובה העיניים.',                                                                                                                                                                                   section: 'home', label: 'הום - כותרת שורה 3',      multiline: false },
  { key: 'home.hero.lead',          defaultValue: 'מעל שני עשורים של ייצור נגרות ברמה אדריכלית – חזיתות HPL, חיפויי לובי ונגרות פנים מוקפדת, לפרויקטים פרטיים, מסחריים וציבוריים בכל רחבי הארץ.', section: 'home', label: 'הום - תיאור ראשי',         multiline: true  },
  { key: 'home.hero.servicesLabel', defaultValue: 'השירותים שלנו',                                                                                                                                                                                    section: 'home', label: 'הום - תווית שירותים',     multiline: false },
  { key: 'home.hero.servicesValue', defaultValue: 'חיפוי HPL · נגרות · לובי',                                                                                                                                                                        section: 'home', label: 'הום - ערך שירותים',       multiline: false },
  { key: 'home.hero.servicesNote',  defaultValue: 'תכנון · ייצור · התקנה',                                                                                                                                                                            section: 'home', label: 'הום - הערת שירותים',      multiline: false },
  { key: 'home.hero.ctaLabel',      defaultValue: 'לפרויקט חדש',                                                                                                                                                                                      section: 'home', label: 'הום - תווית CTA',          multiline: false },
  { key: 'home.hero.ctaPrimary',    defaultValue: 'לקבלת הצעת מחיר ←',                                                                                                                                                                               section: 'home', label: 'הום - כפתור ראשי',        multiline: false },
  { key: 'home.hero.ctaGhost',      defaultValue: 'תיק עבודות',                                                                                                                                                                                       section: 'home', label: 'הום - כפתור משני',        multiline: false },
];

export function registryToMap() {
  return Object.fromEntries(registry.map(({ key, defaultValue }) => [key, defaultValue]));
}
