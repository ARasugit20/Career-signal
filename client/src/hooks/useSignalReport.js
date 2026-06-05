import { useCallback, useMemo, useState } from "react";
import { buildStaticReport } from "../lib/buildStaticReport";
import { API_BASE, REPORT_MODE } from "../lib/config";

export function useSignalReport(companies) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const companyLookup = useMemo(() => {
    const map = new Map();
    (companies || []).forEach((company) => {
      map.set(company.id, company);
    });
    return map;
  }, [companies]);

  const generateSignal = useCallback(async (companyId, roleId) => {
    setLoading(true);
    setError("");
    setReport(null);

    try {
      if (REPORT_MODE === "static") {
        const companyData = companyLookup.get(companyId);
        if (!companyData) {
          throw new Error("Selected company was not found in local data.");
        }
        const roleData = companyData.roles?.[roleId];
        if (!roleData) {
          throw new Error("Selected role was not found for this company.");
        }
        setReport(buildStaticReport(companyData, roleData));
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_BASE}/signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: companyId, role: roleId }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to generate report.");
      }

      setReport(payload.report);
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "Request timed out after 30 seconds. Please try again or choose another target."
        );
      } else {
        setError(err.message || "Something went wrong while generating report.");
      }
    } finally {
      setLoading(false);
    }
  }, [companyLookup]);

  return {
    report,
    loading,
    error,
    generateSignal
  };
}
