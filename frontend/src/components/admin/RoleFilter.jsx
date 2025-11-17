import "../../style/RoleFilter.css";

export default function RoleFilter({ role = "all", onChange }) {
  const options = [
    { value: "all", label: "Todos" },
    { value: "admin", label: "Administadores" },
    { value: "user", label: "Usuarios" },
  ];
  return (
    <div className="role-filter" role="tablist">
      {options.map((opt) => {
        const active = role === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={`role-chip${active ? " active" : ""}`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
