import "../../style/Pagination.css";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const go = (p) => {
    if (!onPageChange) return;
    const next = Math.min(Math.max(1, p), totalPages || 1);
    if (next !== page) onPageChange(next);
  };

  return (
    <div className="pg">
      <button
        className="pg-btn"
        onClick={() => go(page - 1)}
        disabled={!canPrev}
      >
        Anterior
      </button>

      <span className="pg-label">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        className="pg-btn"
        onClick={() => go(page + 1)}
        disabled={!canNext}
      >
        Siguiente
      </button>
    </div>
  );
}
