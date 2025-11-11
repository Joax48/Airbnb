import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import "../../style/ApprovalButtons.css";

export default function ApproveConfirmDialog({
  open,
  title = "Aprobar propiedad",
  message = "¿Estás seguro de que deseas aprobar esta propiedad? Esta acción la hará visible para los usuarios.",
  confirmText = "Aprobar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open && confirmRef.current) confirmRef.current.focus();
    const handler = (e) => {
      if (!open) return;
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") onConfirm?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="approve-title" aria-describedby="approve-desc">
      <div className="modal approve-modal">
        <div className="approve-header">
          <CheckCircle2 className="approve-icon" size={22} aria-hidden="true" />
          <h3 id="approve-title" className="approve-title">{title}</h3>
        </div>

        <p id="approve-desc" className="approve-text">{message}</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className="approve-btn"
            onClick={onConfirm}
            ref={confirmRef}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
