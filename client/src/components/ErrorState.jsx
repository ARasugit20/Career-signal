export default function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-rose-600/30 bg-rose-950/20 p-4">
      <p className="font-semibold text-rose-200">Could not generate report</p>
      <p className="mt-1 text-sm text-rose-100/90">
        {message || "Please try again in a moment."}
      </p>
    </div>
  );
}
