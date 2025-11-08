import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/client";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then(r => setLogs(r.data || []));
  }, []);

  return (
    <>
      <h1>Logs de auditoría</h1>
      <p>(Luego: firma digital y verificación de integridad)</p>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </>
  );
}
