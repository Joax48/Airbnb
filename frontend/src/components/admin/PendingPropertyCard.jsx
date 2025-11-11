import ApprovalButtons from "./ApprovalButtons";
import "../../style/PendingPropertyCard.css";
import { Home, MapPin, DollarSign } from "lucide-react";

export default function PendingPropertyCard({ property, onApprove, onReject }) {
  const {
    id_property, 
    name,
    type,
    description,
    price,
    status,
    approved,
    location,
  } = property;

  return (
    <article className="card">
      <div className="header">
        <h3 className="title">
          #{id_property} · {name || 'Alojamiento'}
        </h3>
        <div className="actions">
          <ApprovalButtons id={id_property} onApprove={onApprove} onReject={onReject} />
        </div>
      </div>

      <div className="property-info">
        {type && (
          <div className="info-item">
            <Home className="icon" size={16} />
            <span>{type}</span>
          </div>
        )}
        {price && (
          <div className="info-item">
            <DollarSign className="icon" size={16} />
            <span>₡{Number(price).toLocaleString("es-CR")}</span>
          </div>
        )}
        {location && (
          <div className="info-item">
            <MapPin className="icon" size={16} />
            <span>{location}</span>
          </div>
        )}
      </div>
      
      {description && (
        <p className="description">{description}</p>
      )}
      
    </article>
  );
}