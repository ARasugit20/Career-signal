import CompanySelector from "../components/CompanySelector";
import RoleSelector from "../components/RoleSelector";

export default function Home({
  companies,
  selectedCompany,
  selectedRole,
  onSelectCompany,
  onSelectRole,
  onSubmit,
  onTryExample,
  disabled
}) {
  const activeCompany = companies.find((item) => item.id === selectedCompany);
  const rolesRaw = activeCompany?.roles || [];
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw
    : Object.entries(rolesRaw).map(([id, role]) => ({ id, title: role.title }));

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:p-7">
      <h1 className="text-2xl font-bold leading-tight text-slate-100 md:text-3xl">
        Pick a company and role.
        <br />
        <span className="text-indigo-300">Get projects, JD keywords, and interview framing.</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        Career Signal turns curated hiring signals into a shareable report — three project ideas,
        skill bands, and a one-line framing tip recruiters actually scan for.
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !selectedCompany || !selectedRole}
          className="rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Generate Signal Report
        </button>
        <button
          type="button"
          onClick={onTryExample}
          disabled={disabled}
          className="text-sm font-semibold text-indigo-300 underline-offset-2 transition hover:text-indigo-200 hover:underline disabled:opacity-60"
        >
          Try an example →
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Shareable links are created automatically after you generate a report.
      </p>
    </section>
  );
}
