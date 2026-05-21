import { useMemo, useState } from "react";

export default function CompanySelector({ companies, value, onChange }) {
  const [query, setQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return companies;
    return companies.filter((company) =>
      `${company.name} ${company.tier || ""} ${company.industry || ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [companies, query]);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-300">Target Company</span>
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400"
        placeholder="Search company, tier, or industry"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a company</option>
        {filteredCompanies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name} ({company.industry})
          </option>
        ))}
      </select>
    </label>
  );
}
