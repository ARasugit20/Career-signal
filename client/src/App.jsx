import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Home from "./pages/Home";
import Report from "./pages/Report";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import AppHeader from "./components/AppHeader";
import { useSignalReport } from "./hooks/useSignalReport";
import companiesLocal from "./data/companies.json";
import GapAnalysis from "./pages/GapAnalysis";
import Outreach from "./pages/Outreach";
import { buildAppUrl, buildShareUrl, getTabFromUrl } from "./lib/shareUrl";
import { updateReportMeta, resetPageMeta } from "./lib/updatePageMeta";
import { API_BASE, IS_STATIC_MODE } from "./lib/config";

export default function App() {
  const [activeTab, setActiveTab] = useState(() => getTabFromUrl());
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [companiesError, setCompaniesError] = useState("");
  const reportSectionRef = useRef(null);
  const deepLinkHandled = useRef(false);
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

  const switchTab = useCallback((tabId) => {
    setActiveTab(tabId);
    window.history.replaceState({}, "", buildAppUrl({ tab: tabId }));
  }, []);

  useEffect(() => {
    function onPopState() {
      setActiveTab(getTabFromUrl());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!companies.length || deepLinkHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const companyFromUrl = params.get("company");
    const roleFromUrl = params.get("role");
    if (!companyFromUrl || !roleFromUrl) return;

    const companyData = companies.find((item) => item.id === companyFromUrl);
    const roleExists = companyData?.roles?.[roleFromUrl];
    if (!companyData || !roleExists) return;

    deepLinkHandled.current = true;
    setSelectedCompany(companyFromUrl);
    setSelectedRole(roleFromUrl);
    generateSignal(companyFromUrl, roleFromUrl);
  }, [companies, generateSignal]);

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
    const shareUrl = buildShareUrl(selectedCompany, selectedRole);
    window.history.replaceState({}, "", shareUrl);
    generateSignal(selectedCompany, selectedRole);
  }

  function tryExample() {
    setSelectedCompany("amazon");
    setSelectedRole("sde-intern");
    const shareUrl = buildShareUrl("amazon", "sde-intern");
    window.history.replaceState({}, "", shareUrl);
    generateSignal("amazon", "sde-intern");
  }

  function scrollToSelector() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (report && selectedCompany && selectedRole) {
      const shareUrl = buildShareUrl(selectedCompany, selectedRole);
      updateReportMeta(report, shareUrl);
      reportSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    resetPageMeta();
  }, [report, selectedCompany, selectedRole]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <AppHeader activeTab={activeTab} onTabChange={switchTab} />
      <div className="grid gap-5">
        {activeTab === "signal" && (
          <>
            <Home
              companies={companies}
              selectedCompany={selectedCompany}
              selectedRole={selectedRole}
              onSelectCompany={setSelectedCompany}
              onSelectRole={setSelectedRole}
              onSubmit={onSubmit}
              onTryExample={tryExample}
              disabled={loading || !!companiesError}
            />

            {companiesError && <ErrorState message={companiesError} />}
            {loading && (
              <LoadingState companyName={activeCompanyName} roleTitle={activeRoleTitle} />
            )}
            {error && <ErrorState message={error} />}
            {report && (
              <div ref={reportSectionRef}>
                <Report
                  report={report}
                  companyId={selectedCompany}
                  roleId={selectedRole}
                  onChooseAnother={scrollToSelector}
                />
              </div>
            )}
          </>
        )}

        {activeTab === "gap" && <GapAnalysis companies={companies} />}
        {activeTab === "outreach" && <Outreach companies={companies} />}
      </div>
    </main>
  );
}
