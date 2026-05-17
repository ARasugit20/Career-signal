const STYLE_BY_LABEL = {
  "Strong Signal": "bg-emerald-600/20 text-emerald-300 border-emerald-500/40",
  Developing: "bg-amber-600/20 text-amber-300 border-amber-500/40",
  Gap: "bg-rose-600/20 text-rose-300 border-rose-500/40"
};

function SignalBand({ label, items }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STYLE_BY_LABEL[label]}`}>
        {label}
      </p>
      <ul className="mt-2 space-y-1">
        {(items || []).map((item) => (
          <li key={`${label}-${item}`} className="text-sm text-slate-300">
            - {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SignalStrengthBar({ bands }) {
  const strong = bands?.strong || [];
  const developing = bands?.developing || [];
  const gap = bands?.gap || [];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SignalBand label="Strong Signal" items={strong} />
      <SignalBand label="Developing" items={developing} />
      <SignalBand label="Gap" items={gap} />
    </div>
  );
}
