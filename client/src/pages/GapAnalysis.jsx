import { useMemo, useState } from "react";
import ErrorState from "../components/ErrorState";
import SignalStrengthBar from "../components/SignalStrengthBar";
import { analyzeGitHubGap } from "../lib/analyzeGitHubGap";

export default function GapAnalysis({ companies }) {
  const [username, setUsername] = useState("ARasugit20");
  const [resumeText, setResumeText] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const company = useMemo(
    () => companies.find((item) => item.id === companyId),
    [companies, companyId]
  );

  const jdKeywords = useMemo(() => {
    if (!company) return [];
    const roleEntries = Object.values(company.roles || {});
    return roleEntries.flatMap((role) => role.jd_keywords || []);
  }, [company]);

  async function runAnalysis() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const analysis = await analyzeGitHubGap({
        username: username.trim(),
        resumeText,
        jdKeywords
      });
      setResult(analysis);
    } catch (err) {
      setError(err.message || "Unable to run GitHub gap analysis.");
    } finally {
      setLoading(false);
    }
  }

  const bands = result
    ? {
        strong: result.bands.strong,
        developing: result.bands.developing,
        gap: result.bands.gap
      }
    : null;

  return (
    <section className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:p-7">
      <header>
        <p className="text-xs uppercase tracking-wider text-indigo-300">Gap Analysis</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-100">GitHub + resume skill gap scan</h2>
        <p className="mt-2 text-sm text-slate-300">
          Compare what you claim, what your repos show, and what target companies ask for.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">GitHub username</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Target company (optional JD baseline)
          </span>
          <select
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
          >
            <option value="">No company baseline</option>
            {companies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-300">Resume bullets / skills</span>
        <textarea
          rows={6}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400"
          placeholder="Paste resume bullets or a skill list..."
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
        />
      </label>

      <button
        type="button"
        onClick={runAnalysis}
        disabled={loading || !username.trim()}
        className="rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Run Gap Analysis"}
      </button>

      {error && <ErrorState message={error} />}

      {result && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Scanned {result.repoCount} public repos for <span className="font-semibold">{username}</span>.
          </p>

          <SignalStrengthBar bands={bands} />

          {!!result.bands.developing.length && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-sm font-semibold text-amber-200">Actionable gaps</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-100">
                {result.bands.developing.map((skill) => (
                  <li key={skill}>
                    - You claim {skill} but no public repo clearly demonstrates it. Build one
                    focused project feature and publish it.
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
