import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/stats", async (req, res) => {
  const username = req.query.username || "RisinaLiliia";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = await response.json();

    const repoCount = repos.length;

    const svg = `
      <svg width="300" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="80" fill="#1e1e1e" rx="10"/>
        <text x="150" y="50" font-size="24" fill="#ffffff" text-anchor="middle" font-family="Arial">
          Repos: ${repoCount}
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
