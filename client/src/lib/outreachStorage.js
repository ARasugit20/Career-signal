const STORAGE_KEY = "career-signal-outreach";

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function loadOutreachEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveOutreachEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function exportOutreachEntries(entries) {
  return JSON.stringify(entries, null, 2);
}

export function importOutreachEntries(serialized) {
  const parsed = safeParse(serialized);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid outreach import format.");
  }
  return parsed;
}

export function getFollowUpsDueThisWeek(entries, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return entries.filter((entry) => {
    if (!entry.followUpDate) return false;
    const date = new Date(entry.followUpDate);
    return date >= start && date <= end;
  });
}

export { STORAGE_KEY };
