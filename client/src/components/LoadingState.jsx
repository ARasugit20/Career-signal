export default function LoadingState({ companyName, roleTitle }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-sm font-medium text-indigo-300">Generating Signal Report...</p>
      <p className="mt-2 text-sm text-slate-300">
        Analyzing hiring patterns for {companyName || "your target company"}{" "}
        {roleTitle ? `(${roleTitle})` : ""}. This usually takes under 30 seconds.
      </p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500" />
      </div>
    </div>
  );
}
