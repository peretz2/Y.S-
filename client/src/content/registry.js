export const registry = [
  { key: 'nav.home',     defaultValue: 'בית',       section: 'nav', label: 'ניווט – בית',         multiline: false },
  { key: 'nav.about',    defaultValue: 'אודות',      section: 'nav', label: 'ניווט – אודות',        multiline: false },
  { key: 'nav.services', defaultValue: 'שירותים',    section: 'nav', label: 'ניווט – שירותים',      multiline: false },
  { key: 'nav.projects', defaultValue: 'פרויקטים',   section: 'nav', label: 'ניווט – פרויקטים',     multiline: false },
  { key: 'nav.contact',  defaultValue: 'צור קשר',    section: 'nav', label: 'ניווט – צור קשר',      multiline: false },
];

export function registryToMap() {
  return Object.fromEntries(registry.map(({ key, defaultValue }) => [key, defaultValue]));
}
