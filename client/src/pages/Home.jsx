import CompanySelector from "../components/CompanySelector";
import RoleSelector from "../components/RoleSelector";

export default function Home({
  companies,
  selectedCompany,
  selectedRole,
  onSelectCompany,
  onSelectRole,
  onSubmit,
  reportMode,
  disabled
}) {
  const activeCompany = companies.find((item) => item.id === selectedCompany);
  const rolesRaw = activeCompany?.roles || [];
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw
    : Object.entries(rolesRaw).map(([id, role]) => ({ id, title: role.title }));

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:p-7">
      <p className="text-xs uppercase tracking-wider text-indigo-300">Career Signal</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-100 md:text-3xl">
        Build projects that send real hiring signal
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Choose your target company and role to generate a tailored Signal Report.
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Mode: {reportMode === "static" ? "Static (no API cost)" : "AI-generated"}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <CompanySelector
          companies={companies}
          value={selectedCompany}
          onChange={(companyId) => {
            onSelectCompany(companyId);
            onSelectRole("");
          }}
        />
        <RoleSelector
          roles={roles}
          value={selectedRole}
          onChange={onSelectRole}
          disabled={!selectedCompany}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !selectedCompany || !selectedRole}
        className="mt-6 w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        Generate Signal Report
      </button>
      <p className="mt-3 text-xs text-slate-400">
        Tip: shareable links are created automatically after you generate a report.
      </p>
    </section>
  );
}
