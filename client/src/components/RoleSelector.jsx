export default function RoleSelector({ roles, value, onChange, disabled }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-300">Target Role</span>
      <select
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">Select a role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.title}
          </option>
        ))}
      </select>
    </label>
  );
}
