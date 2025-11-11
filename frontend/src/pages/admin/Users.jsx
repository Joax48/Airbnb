import React, { useEffect, useState } from "react";
import { getRegisteredUsers } from "../../api/apiClient.js";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getRegisteredUsers().then(r => setUsers(r.data || []));
  }, []);

  return (
    <>
      <h1>Usuarios registrados</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}
