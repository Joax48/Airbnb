import { DollarSign, Info } from "lucide-react";
import ApprovalButtons from "./ApprovalButtons.jsx";
import "../../style/PendingCard.css";

export default function PendingActivityCard({ activity, onApprove, onReject }) {
  const { id_activity, name, category, description, price } = activity || {};

  return (
    <article className="card">
      <div className="header">
        <div>
          <h3 className="title">#{id_activity} · {name || "Actividad"}</h3>
          <div className="meta">
            Pendiente de revisión
          </div>
        </div>

        <div className="actions">
          <ApprovalButtons
            id={id_activity}
            onApprove={() => onApprove?.(activity)}
            onReject={(_id, reason) => onReject?.(activity, reason)}
          />
        </div>
      </div>

      <div className="property-info">
        {category && (
          <div className="info-item" title="Categoría">
            <Info size={16} className="icon" />
            <span>{category}</span>
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