import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: false, // true en producción
});

pool.on("connect", (client) => {
  client.query(`SET search_path TO ${process.env.DB_SCHEMA}`);
});

pool.connect()
  .then(() =>
    console.log(`Conectado a PostgreSQL (DB: ${process.env.DB_NAME}, esquema: ${process.env.DB_SCHEMA})`)
  )
  .catch((err) => console.error("Error al conectar con PostgreSQL:", err.message));
