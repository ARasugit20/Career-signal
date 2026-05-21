import { useMemo, useState } from "react";
import {
  exportOutreachEntries,
  getFollowUpsDueThisWeek,
  importOutreachEntries,
  loadOutreachEntries,
  saveOutreachEntries
} from "../lib/outreachStorage";

function newId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useOutreachTracker() {
  const [entries, setEntries] = useState(() => loadOutreachEntries());

  function commit(nextEntries) {
    setEntries(nextEntries);
    saveOutreachEntries(nextEntries);
  }

  function addEntry(entry) {
    commit([{ ...entry, id: newId() }, ...entries]);
  }

  function updateEntry(id, updates) {
    commit(entries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)));
  }

  function deleteEntry(id) {
    commit(entries.filter((entry) => entry.id !== id));
  }

  function importEntries(serialized) {
    const parsed = importOutreachEntries(serialized);
    commit(parsed);
  }

  function exportEntries() {
    return exportOutreachEntries(entries);
  }

  const dueThisWeek = useMemo(() => getFollowUpsDueThisWeek(entries), [entries]);

  return {
    entries,
    dueThisWeek,
    addEntry,
    updateEntry,
    deleteEntry,
    importEntries,
    exportEntries
  };
}
