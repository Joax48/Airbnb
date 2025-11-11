import "../../style/Toolbar.css";

export default function Toolbar({ filter, onFilterChange, onReload, loading }) {
  return (
    <div className="toolbar">
      <input
      className="input"
      value={filter}
      onChange={e => onFilterChange(e.target.value)}
      placeholder="Filtrar por nombre o ID..."
      />
      <button
      className="reload-btn"
      onClick={onReload}
      disabled={loading}
      title="Recargar"
      >
        {loading ? 'Cargando...' : 'Recargar'}
      </button>
    </div>
  );
}