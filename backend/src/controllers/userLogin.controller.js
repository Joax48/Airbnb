import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
//import yub from "yub";

import { generateToken } from "../middleware/jwt.auth.js";

//const yubico = yub.init(process.env.YUBI_CLIENT_ID, process.env.YUBI_SECRET_KEY);

export const LogIn = async (req, res) => {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
        return res.status(400).json({ message: "Error: el cuerpo de la solicitud debe llevar" +
            " email, password y otp" });
    }
    try {
        const userData = await findUserByUsername(email);
        // Validates with password
        var result = await bcrypt.compare(password, userData.password_hash);
        if (!result) {
            return res.status(401).json( { message: "Contraseña incorrecta" } );
        }
        // Validates with yubikey
        // result = await yubico.verify(otp);
        // if (!result.valid || result.publicId !== userData.yubikeypublicid) {
        //     return res.status(401).json( { message: "Invalid Yubikey 2FA OTP" } );
        // }
        const token = generateToken(userData)
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
        console.error(error);
        throw error;
    }
};
