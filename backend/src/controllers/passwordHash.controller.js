import bcrypt from "bcrypt";

export const insertUsers = async (req, res) => {
  try {
    const { users } = req.body;
    let valueStrings = [];

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);

      // Escapar comillas simples dentro de strings
      const name = user.name.replace(/'/g, "''");
      const email = user.email.replace(/'/g, "''");
      const role = user.role.replace(/'/g, "''");
      const yub = user.yub.replace(/'/g, "''");

      valueStrings.push(`('${name}', '${email}', '${hash}', '${role}', '${yub}')`);
    }

    const sqlQuery = 'INSERT INTO airbnb_secure."User" (name, email, password_hash, role, yubikey_public_id) '+ `VALUES ${valueStrings.join(",")};`;

    return res.status(200).json({ sql: sqlQuery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error generando el query" });
  }
};
