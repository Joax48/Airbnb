import "../../style/Toolbar.css";

export default function Toolbar({
  filter,
  onFilterChange,
  onReload,
  loading,
  placeholder = "Filtrar por nombre o ID...",
  buttonLabel = "Recargar",
  loadingLabel = "Cargando...",
}) {
  return (
    <div className="toolbar">
      <input
        className="input"
        value={filter}
        onChange={e => onFilterChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className="reload-btn"
        onClick={onReload}
        disabled={loading}
        title={buttonLabel}
      >
        {loading ? loadingLabel : buttonLabel}
      </button>
    </div>
  );
}
