import { useEffect, useMemo, useRef, useState } from "react";

export default function CompanySelector({ companies, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = companies.find((c) => c.id === value);

  useEffect(() => {
    if (selected) setQuery(selected.name);
  }, [selected?.id, selected?.name]);

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return companies;
    return companies.filter((company) =>
      `${company.name} ${company.tier || ""} ${company.industry || ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [companies, query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function pickCompany(company) {
    onChange(company.id);
    setQuery(company.name);
    setOpen(false);
  }

  return (
    <label className="flex flex-col gap-2" ref={containerRef}>
      <span className="text-sm font-medium text-slate-300">Target Company</span>
      <div className="relative">
        <input
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400"
          placeholder="Search company, tier, or industry"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (!event.target.value.trim()) onChange("");
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        {open && filteredCompanies.length > 0 && (
          <ul
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-lg"
            role="listbox"
          >
            {filteredCompanies.map((company) => (
              <li key={company.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === company.id}
                  className={`w-full px-4 py-2 text-left text-sm transition hover:bg-slate-800 ${
                    value === company.id ? "bg-indigo-500/15 text-indigo-200" : "text-slate-200"
                  }`}
                  onClick={() => pickCompany(company)}
                >
                  {company.name}{" "}
                  <span className="text-slate-500">
                    ({company.tier} · {company.industry})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && query.trim() && filteredCompanies.length === 0 && (
          <p className="absolute z-20 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-400">
            No companies match your search.
          </p>
        )}
      </div>
    </label>
  );
}
