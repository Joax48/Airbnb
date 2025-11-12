import { Inbox } from "lucide-react";

import "../../style/EmptyState.css";

export default function EmptyState({ title = "Sin resultados", description = "" }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={22} aria-hidden="true" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}
