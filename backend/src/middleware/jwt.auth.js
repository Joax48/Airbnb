import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.email = payload.email;
    req.id_user = payload.id_user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}

export const generateToken = (user) => {
  return jwt.sign({ Id: user.id_user, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}
