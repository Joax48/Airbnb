import jwt from "jsonwebtoken";

export const VerifyJWTValid = async (req, res) => {
    const { jwt: token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "Error: el cuerpo de la solicitud debe llevar" +
            " jwt" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ valid: true })
    } catch (error) {
        return res.status(403).json({ message: "Token no valido" });
    }
}

