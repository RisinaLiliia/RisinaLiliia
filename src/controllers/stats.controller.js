import { getUser, getRepos } from "../services/github.service.js";
import { setCache, getCache } from "../utils/cache.js";
import { generateStatsSVG } from "../components/statsSvg.js";

export const getStats = async (req, res) => {
  const username = String(
    req.query.username || "RisinaLiliia"
  ).trim();

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(400).send("Invalid GitHub username");
  }

  if (
    username.startsWith("-") ||
    username.endsWith("-") ||
    username.includes("--")
  ) {
    return res.status(400).send("Invalid GitHub username");
  }

  const cacheKey = `stats_${username.toLowerCase()}`;

  const cached = getCache(cacheKey);

  if (cached) {
    return sendSvg(res, cached);
  }

  try {
    const user = await getUser(username);
    const repos = await getRepos(username);

    const stats = {
      repoCount: user.public_repos,
      followers: user.followers,
      following: user.following,
      stars: repos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0
      ),
      forks: repos.reduce(
        (sum, repo) => sum + (repo.forks_count || 0),
        0
      ),
    };

    const svg = generateStatsSVG(username, stats);

    setCache(cacheKey, svg);

    return sendSvg(res, svg);
  } catch (error) {
    console.error(
      `Failed to generate stats for ${username}:`,
      error
    );

    return res
      .status(500)
      .send("Failed to generate GitHub statistics");
  }
};

const sendSvg = (res, svg) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, must-revalidate"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(svg);
};
