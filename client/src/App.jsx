import { useEffect, useMemo, useState } from "react";
import Home from "./pages/Home";
import Report from "./pages/Report";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { useSignalReport } from "./hooks/useSignalReport";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [companiesError, setCompaniesError] = useState("");
  const { report, loading, error, generateSignal } = useSignalReport();

  useEffect(() => {
    async function loadCompanies() {
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

  const activeCompanyName = useMemo(
    () => companies.find((item) => item.id === selectedCompany)?.name || "",
    [companies, selectedCompany]
  );

  const activeRoleTitle = useMemo(() => {
    const activeCompany = companies.find((item) => item.id === selectedCompany);
    return activeCompany?.roles.find((item) => item.id === selectedRole)?.title || "";
  }, [companies, selectedCompany, selectedRole]);

  function onSubmit() {
    if (!selectedCompany || !selectedRole) return;
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
