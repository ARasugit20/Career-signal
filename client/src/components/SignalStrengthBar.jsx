const STYLE_BY_LABEL = {
  "Strong Signal": "bg-emerald-600/20 text-emerald-300 border-emerald-500/40",
  Developing: "bg-amber-600/20 text-amber-300 border-amber-500/40",
  Gap: "bg-rose-600/20 text-rose-300 border-rose-500/40"
};

export default function SignalStrengthBar() {
  const labels = ["Strong Signal", "Developing", "Gap"];
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${STYLE_BY_LABEL[label]}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
