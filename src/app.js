import express from "express";
import statsRoutes from "./routes/stats.routes.js";
import langsRoutes from "./routes/langs.routes.js";

const app = express();


app.set("trust proxy", 1);

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

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
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
