import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export function useSignalReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateSignal(companyId, roleId) {
    setLoading(true);
    setError("");
    setReport(null);

    try {
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
  }

  return {
    report,
    loading,
    error,
    generateSignal
  };
}
