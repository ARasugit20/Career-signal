import { useEffect, useMemo, useState } from "react";
import Home from "./pages/Home";
import Report from "./pages/Report";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { useSignalReport } from "./hooks/useSignalReport";
import companiesLocal from "./data/companies.json";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const REPORT_MODE = import.meta.env.VITE_REPORT_MODE || "static";
const IS_STATIC_MODE = REPORT_MODE === "static";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [companiesError, setCompaniesError] = useState("");
  const { report, loading, error, generateSignal } = useSignalReport(companies);

  useEffect(() => {
    async function loadCompanies() {
      if (IS_STATIC_MODE) {
        setCompanies(companiesLocal);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/companies`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Could not fetch companies.");
        }
        setCompanies(payload);
      } catch (err) {
        setCompaniesError(err.message || "Could not load target companies.");
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    if (!companies.length) return;
    const params = new URLSearchParams(window.location.search);
    const companyFromUrl = params.get("company");
    const roleFromUrl = params.get("role");
    if (!companyFromUrl || !roleFromUrl) return;

    const companyData = companies.find((item) => item.id === companyFromUrl);
    const roleExists = companyData?.roles?.[roleFromUrl];
    if (!companyData || !roleExists) return;

    setSelectedCompany(companyFromUrl);
    setSelectedRole(roleFromUrl);
    generateSignal(companyFromUrl, roleFromUrl);
  }, [companies]);

  const activeCompanyName = useMemo(
    () => companies.find((item) => item.id === selectedCompany)?.name || "",
    [companies, selectedCompany]
  );

  const activeRoleTitle = useMemo(() => {
    const activeCompany = companies.find((item) => item.id === selectedCompany);
    if (!activeCompany?.roles) return "";

    if (Array.isArray(activeCompany.roles)) {
      return activeCompany.roles.find((item) => item.id === selectedRole)?.title || "";
    }

    return activeCompany.roles?.[selectedRole]?.title || "";
  }, [companies, selectedCompany, selectedRole]);

  function onSubmit() {
    if (!selectedCompany || !selectedRole) return;
    const params = new URLSearchParams(window.location.search);
    params.set("company", selectedCompany);
    params.set("role", selectedRole);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    generateSignal(selectedCompany, selectedRole);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="grid gap-5">
        <Home
          companies={companies}
          selectedCompany={selectedCompany}
          selectedRole={selectedRole}
          onSelectCompany={setSelectedCompany}
          onSelectRole={setSelectedRole}
          onSubmit={onSubmit}
          reportMode={REPORT_MODE}
          disabled={loading || !!companiesError}
        />

        {companiesError && <ErrorState message={companiesError} />}
        {loading && (
          <LoadingState companyName={activeCompanyName} roleTitle={activeRoleTitle} />
        )}
        {error && <ErrorState message={error} />}
        {report && <Report report={report} />}
      </div>
    </main>
  );
}
