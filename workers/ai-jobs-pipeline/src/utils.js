const EU_KEYWORDS = [
  'uk', 'united kingdom', 'london', 'england', 'great britain',
  'germany', 'berlin', 'munich', 'hamburg', 'cologne', 'frankfurt',
  'france', 'paris', 'lyon', 'nice',
  'netherlands', 'amsterdam', 'rotterdam', 'utrecht', 'hague',
  'spain', 'madrid', 'barcelona', 'valencia',
  'portugal', 'lisbon', 'porto', 'braga',
  'italy', 'milan', 'rome', 'turin',
  'ireland', 'dublin', 'cork', 'galway',
  'switzerland', 'zurich', 'geneva', 'basel',
  'sweden', 'stockholm', 'gothenburg',
  'denmark', 'copenhagen', 'aarhus',
  'finland', 'helsinki', 'espoo',
  'norway', 'oslo', 'bergen',
  'belgium', 'brussels', 'antwerp', 'ghent',
  'austria', 'vienna', 'salzburg', 'linz',
  'poland', 'warsaw', 'krakow', 'wroclaw',
  'czech', 'prague', 'brno',
  'hungary', 'budapest',
  'romania', 'bucharest', 'cluj',
  'bulgaria', 'sofia',
  'greece', 'athens',
  'europe', 'eu',
  'remote', 'global', 'anywhere',
];

const DROP_DEPARTMENTS = [
  'sales', 'marketing', 'hr', 'people', 'finance', 'legal',
  'support', 'customer success', 'professional services',
  'go to market', 'communications', 'hq management',
  'recruiting', 'safeguard', 'trust & safety', 'business',
  'field engineering', 'solutions', 'consulting', 'corporate',
];

export function isEuLocation(locLower) {
  return EU_KEYWORDS.some(k => locLower.includes(k));
}

export function isTechDept(dept) {
  if (!dept) return true;
  const d = dept.toLowerCase();
  return !DROP_DEPARTMENTS.some(bad => d.includes(bad));
}

export function classifySeniority(title) {
  const t = title.toLowerCase();
  if (/vp |vice president|director|head of|chief|cto|cfo|svp|evp/.test(t)) return 'executive';
  if (/principal|staff|lead|manager|architect/.test(t)) return 'lead';
  if (/senior| sr[ .]/.test(t)) return 'senior';
  if (/junior|jr |intern|graduate|trainee/.test(t)) return 'entry';
  return 'mid';
}

export function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
