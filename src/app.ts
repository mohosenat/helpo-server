import express from "express";
import cors from "cors";
import eventRouter from "./routes/event.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

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
