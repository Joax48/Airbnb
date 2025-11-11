import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.js";

import propertyRoutes from "./routes/property.js";
import activityRoutes from "./routes/activity.js";
import serviceRoutes from "./routes/service.js";
import userRoutes from "./routes/user.routes.js";
import jwtAuthRoutes from "./routes/jwtAuth.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173",
credentials: true 
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/properties", propertyRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jwt/", jwtAuthRoutes);
app.use("/api/admin/approval", approvalRoutes);

app.get("/", (req, res) => {
  res.send("API SecureBNB funcionando correctamente");
});

export default app;
