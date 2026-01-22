import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

export function AppRoute(app) {
  app.use(cors());

  app.use(express.json());

  app.use("/api", routes);

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  });
}
