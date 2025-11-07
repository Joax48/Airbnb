import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.js";

import propertyRoutes from "./routes/property.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import userRoutes from "./routes/user.routes.js";
import jwtAuthRoutes from "./routes/jwtAuth.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/properties", propertyRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jwt/", jwtAuthRoutes);

app.get("/", (req, res) => {
  res.send("API SecureBNB funcionando correctamente");
});

export default app;
