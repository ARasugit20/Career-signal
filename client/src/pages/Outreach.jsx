import { useMemo, useState } from "react";
import { useOutreachTracker } from "../hooks/useOutreachTracker";

const STATUS_OPTIONS = ["applied", "replied", "rejected", "offer", "info-chat"];

function defaultEntry() {
  return {
    company: "",
    companyId: "",
    role: "",
    contactName: "",
    linkedinUrl: "",
    dateSent: "",
    followUpDate: "",
    status: "applied",
    notes: ""
  };
}

function buildTemplate(company, roleData) {
  if (!company || !roleData) return "";
  const keyword = roleData.jd_keywords?.[0] || "backend systems";
  return `Hi [Name], I'm Aditya, CS @ ASU (May 2027). I saw you work on [team] at ${company.name}.
I built Career Signal focusing on ${keyword}. Would you be open to a 15-min chat
about ${company.name}'s intern pipeline? Repo: https://github.com/ARasugit20/Career-signal`;
}

export default function Outreach({ companies }) {
  const {
    entries,
    dueThisWeek,
    addEntry,
    updateEntry,
    deleteEntry,
    importEntries,
    exportEntries
  } = useOutreachTracker();

  const [draft, setDraft] = useState(defaultEntry());
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return entries;
    return entries.filter((entry) => entry.status === statusFilter);
  }, [entries, statusFilter]);

  const activeCompany = companies.find((item) => item.id === draft.companyId);
  const firstRole = activeCompany ? Object.values(activeCompany.roles || {})[0] : null;
  const template = buildTemplate(activeCompany, firstRole);

  function submit() {
    if (!draft.company || !draft.role) return;
    addEntry(draft);
    setDraft(defaultEntry());
  }

  function exportJson() {
    const blob = new Blob([exportEntries()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-signal-outreach.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importEntries(text);
  }

  return (
    <section className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:p-7">
      <header>
        <p className="text-xs uppercase tracking-wider text-indigo-300">Outreach Tracker</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-100">Recruiting CRM (local-first)</h2>
        <p className="mt-2 text-sm text-slate-300">
          Track applications, follow-ups, and networking outreach from one dashboard.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm font-semibold text-slate-200">
          Follow-ups due this week: {dueThisWeek.length}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Company</span>
          <select
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={draft.companyId}
            onChange={(event) => {
              const company = companies.find((item) => item.id === event.target.value);
              setDraft((prev) => ({
                ...prev,
                companyId: event.target.value,
                company: company?.name || ""
              }));
            }}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Role</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={draft.role}
            onChange={(event) => setDraft((prev) => ({ ...prev, role: event.target.value }))}
            placeholder="SDE Intern"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Contact name</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={draft.contactName}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, contactName: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Date sent</span>
          <input
            type="date"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={draft.dateSent}
            onChange={(event) => setDraft((prev) => ({ ...prev, dateSent: event.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Follow-up date</span>
          <input
            type="date"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={draft.followUpDate}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, followUpDate: event.target.value }))
            }
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">Status</span>
        <select
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">Template message</span>
        <textarea
          rows={4}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
          value={template}
          readOnly
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={submit}
          className="rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400"
        >
          Add outreach entry
        </button>
        <button
          type="button"
          onClick={exportJson}
          className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
        >
          Export JSON backup
        </button>
        <label className="cursor-pointer rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300">
          Import JSON backup
          <input type="file" accept="application/json" className="hidden" onChange={importJson} />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-300">Filter:</span>
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">all</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-100">
                {entry.company} - {entry.role}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateEntry(entry.id, {
                      status:
                        entry.status === "applied"
                          ? "replied"
                          : entry.status === "replied"
                            ? "offer"
                            : entry.status
                    })
                  }
                  className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-indigo-400"
                >
                  Advance status
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  className="rounded-lg border border-rose-500/50 px-2 py-1 text-xs text-rose-200 hover:border-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-300">Status: {entry.status}</p>
            {entry.followUpDate && (
              <p className="mt-1 text-sm text-slate-300">Follow-up: {entry.followUpDate}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
