import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

import { generateToken } from "../middleware/jwt.auth.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const yub = require("yub");
yub.init(process.env.YUBI_CLIENT_ID, process.env.YUBI_SECRET_KEY);

const verifyYubiOtp = (otp) => {
    return new Promise((resolve, reject) => {
        yub.verify(otp, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

export const LogIn = async (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({
      message: "Debe ingresar email, contraseña y OTP.",
    });
  }

  try {
    const userData = await findUserByUsername(email);
    if (!userData) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPass = await bcrypt.compare(password, userData.password_hash);
    if (!validPass) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    //  (Descomentar cuando se use YubiKey)
    /*
    const result = await verifyYubiOtp(otp);
    if (!result.valid || result.otp.substring(0, 12) !== userData.yubikey_public_id) {
      return res.status(401).json({ message: "Yubikey OTP inválido" });
    }
    */

    const token = generateToken(userData);

    // Guarda token en cookie segura
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Poner true en produccion (HTTPS)
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1h
    });

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id_user: userData.id_user,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(" Error en LogIn:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


const findUserByUsername = async (email) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE email = $1', [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Id del usuario extraido del token
    const userId = req.user.id_user || req.user.Id;

    const result = await pool.query(
      'SELECT id_user, name, email, role FROM "User" WHERE id_user = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return res.status(500).json({ message: "Error al obtener usuario actual" });
  }
};


export const logoutUser = (req, res) => {
  try {
    // Borra la cookie del token
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false, // true en produccion!!!!!
      sameSite: "strict"
    });

    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};