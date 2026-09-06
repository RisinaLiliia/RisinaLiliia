import express from "express";
import statsRoutes from "./routes/stats.routes.js";
import langsRoutes from "./routes/langs.routes.js";

const app = express();

// Render работает через reverse proxy.
// Это необходимо для корректного req.ip.
app.set("trust proxy", 1);

// Не раскрываем лишнюю информацию о технологии.
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send(`
    <h2 style="text-align:center;margin-top:50px;font-family:sans-serif;">
      GitHub Stats API
    </h2>

    <p style="text-align:center;">
      /api/stats?username=User<br>
      /api/top-langs?username=User
    </p>
  `);
});

app.use("/api/stats", statsRoutes);
app.use("/api/top-langs", langsRoutes);

// 404
app.use((req, res) => {
  res.status(404).send("Not found");
});

// ВАЖНО:
// Express определяет error middleware именно по 4 аргументам:
// err, req, res, next
app.use((err, req, res, next) => {
  // Не выводим stack trace или содержимое секретов клиенту.
  console.error("Unhandled application error:", {
    message: err?.message || "Unknown error",
    method: req.method,
    path: req.path,
  });

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).send("Internal server error");
});

export default app;
