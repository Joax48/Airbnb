import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
};

export const generateToken = (user) => {
  return jwt.sign({ Id: user.id_user, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });
}
