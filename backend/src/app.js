import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.js";

import propertyRoutes from "./routes/property.js";
import activityRoutes from "./routes/activity.js";
import serviceRoutes from "./routes/service.js";
import savedRoutes from "./routes/saved.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.js";
import jwtAuthRoutes from "./routes/jwtAuth.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import adminUserRoutes from "./routes/admin.users.routes.js";
import cookieParser from "cookie-parser";
import amenitiesRoutes from "./routes/amenities.js";

import resourceRoutes from "./routes/resources.js";

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
app.use("/api/saved", savedRoutes);
app.use("/api/jwt/", jwtAuthRoutes);
app.use("/api/admin/approval", approvalRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.send("API SecureBNB funcionando correctamente");
});

export default app;



