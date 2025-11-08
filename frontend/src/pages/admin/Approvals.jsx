import React, { useEffect, useState } from "react";
import { getPendingContent } from "../../api/client";

export default function Approvals() {
  const [data, setData] = useState({ lodgings: [], activities: [], services: [] });

  useEffect(() => {
    getPendingContent().then(setData);
  }, []);

  return (
    <>
      <h1>Aprobaciones</h1>
      <p>(Conectar a backend para aprobar/rechazar)</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
