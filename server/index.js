import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signalRouter from "./routes/signal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "career-signal-server" });
});

app.use("/api", signalRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found."
  });
});

const server = app.listen(PORT, () => {
  console.log(`Career Signal server listening on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process (lsof -i :${PORT}) or set PORT in server/.env.`
    );
  } else {
    console.error("Server failed to start:", err.message);
  }
  process.exit(1);
});
