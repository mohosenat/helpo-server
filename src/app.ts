import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import eventRouter from "./routes/event.route.js";
import { authenticateUser } from "./middleware/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Temporary authentication test route
app.get("/api/auth/me", authenticateUser, (_req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: res.locals.user,
  });
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/events", eventRouter);

app.get("/", (_req, res) => {
  res.send("Welcome to Helpo API!");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Helpo API is running!",
  });
});

export default app;
