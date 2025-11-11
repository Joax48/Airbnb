import { DollarSign, Info } from "lucide-react";
import ApprovalButtons from "./ApprovalButtons.jsx";
import "../../style/PendingCard.css";

export default function PendingServiceCard({ service, onApprove, onReject }) {
  const { id_service, name, description, type, price, approved } = service || {};

  return (
    <article className="card">
      <div className="header">
        <div>
          <h3 className="title">#{id_service} · {name || "Servicio"}</h3>
          <div className="meta">
            Pendiente de revisión
          </div>
        </div>

        <div className="actions">
          <ApprovalButtons
            id={id_service}
            onApprove={() => onApprove?.(service)}
            onReject={(_id, reason) => onReject?.(service, reason)}
          />
        </div>
      </div>

      <div className="property-info">
        {type && (
          <div className="info-item" title="Tipo">
            <Info size={16} className="icon" />
            <span>{type}</span>
          </div>
        )}

        {typeof price !== "undefined" && price !== null && (
          <div className="info-item" title="Precio">
            <DollarSign size={16} className="icon" />
            <span>₡{Number(price).toLocaleString("es-CR")}</span>
          </div>
        )}
      </div>

      {description && <p className="description">{description}</p>}
    </article>
  );
}