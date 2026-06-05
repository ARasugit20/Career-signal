const TABS = [
  { id: "signal", label: "Signal Report" },
  { id: "gap", label: "Gap Analysis" },
  { id: "outreach", label: "Outreach" }
];

export default function AppHeader({ activeTab, onTabChange }) {
  return (
    <header className="mb-6 border-b border-slate-800 pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-100">Career Signal</p>
          <p className="text-sm text-slate-400">Role intelligence for CS students</p>
        </div>
        <nav className="flex flex-wrap gap-1" aria-label="Main">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
