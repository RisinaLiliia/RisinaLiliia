import express from "express";
import statsRoutes from "./routes/stats.routes.js";
import langsRoutes from "./routes/langs.routes.js";

const app = express();

app.get("/", (req, res) =>
  res.send(`
    <h2 style="text-align:center;margin-top:50px;font-family:sans-serif;">
      GitHub Stats API
    </h2>
    <p style="text-align:center;">
      /api/stats?username=User<br>
      /api/top-langs?username=User
    </p>
  `)
);

app.use("/api/stats", statsRoutes);
app.use("/api/top-langs", langsRoutes);

export default app;
