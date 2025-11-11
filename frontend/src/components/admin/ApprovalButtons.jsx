import { useState, useEffect } from "react";
import ApproveConfirmDialog from "./ApproveConfirmDialog";
import "../../style/ApprovalButtons.css";

export default function ApprovalButtons({ id, onApprove, onReject }) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const anyOpen = approveOpen || rejectOpen;
    document.body.classList.toggle("modal-open", anyOpen);
    return () => document.body.classList.remove("modal-open");
  }, [approveOpen, rejectOpen]);

  const handleApprove = async () => {
    setApproveOpen(false);
    await onApprove?.(id);
  };

  return (
    <div className="container">
      <button
        className="approve-btn"
        onClick={() => setApproveOpen(true)}
      >
        Aprobar
      </button>

      <button
        className="reject-btn"
        onClick={() => setRejectOpen(true)}
      >
        Rechazar
      </button>

      <ApproveConfirmDialog
        open={approveOpen}
        onCancel={() => setApproveOpen(false)}
        onConfirm={handleApprove}
      />

      {rejectOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h4 className="modal-title">Motivo de rechazo</h4>
            <p className="modal-hint">(Debe contener al menos 3 caracteres.)</p>
            <textarea
              className="text-area"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Información incompleta del anuncio"
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setRejectOpen(false);
                  setReason("");
                }}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  const r = (reason || "").trim();
                  if (r.length < 3) return;
                  onReject?.(id, r);
                  setRejectOpen(false);
                  setReason("");
                }}
                disabled={(reason || "").trim().length < 3}
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
