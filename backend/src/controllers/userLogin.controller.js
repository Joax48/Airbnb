import bcrypt from "bcrypt";
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
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!email || !password || !otp) {
        return res.status(400).json({ message: "Error: el cuerpo de la solicitud debe llevar" +
            " email, password y otp" });
    }
    try {
        const userData = await findUserByUsername(email);
        if (!userData) {
            await auditLogInAttempt(null, "[LOGIN FAILED]: Email Not Found", clientIp);
            return res.status(404).json({ message: "Correo no encontrado" });
        }
        // Validates with password
        var validPass = await bcrypt.compare(password, userData.password_hash);
        if (!validPass) {
            await auditLogInAttempt(userData.id_user, "[LOGIN FAILED]: Incorrect password", clientIp);
            return res.status(401).json( { message: "Contraseña incorrecta" } );
        }
        // Validates with yubikey
        const result = await verifyYubiOtp(otp);

        if (!result.valid || result.otp.substring(0, 12) !== userData.yubikey_public_id) {
            await auditLogInAttempt(userData.id_user, "[LOGIN FAILED]: invalid Yubikey OTP Auth", clientIp);
            return res.status(401).json({ message: "Yubikey 2FA OTP inválido" });
        }

        const token = generateToken(userData)
        await auditLogInAttempt(userData.id_user, "[LOGIN SUCCESS]: Successfull user log in", clientIp);
        return res.status(200).json({ jwt: token })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findUserByUsername = async (email) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE email = $1', [email]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const auditLogInAttempt = async (id_user, action, ip) => {
    try {
        await pool.query(
            'INSERT INTO "AuditLog" (user_id, action, ip_address) VALUES ' +
            '($1, $2, $3)', [id_user, action, ip]
        );
    } catch (error) {
        console.error("Error auditando el intento de inicio de sesion", error.message);
    }
};
