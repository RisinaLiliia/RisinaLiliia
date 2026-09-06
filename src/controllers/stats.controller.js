import {
  getUser,
  getRepos,
  GitHubRateLimitError,
} from "../services/github.service.js";

import { setCache, getCache } from "../utils/cache.js";
import { generateStatsSVG } from "../components/statsSvg.js";

const isValidGitHubUsername = (username) => {
  return (
    /^[a-zA-Z0-9-]{1,39}$/.test(username) &&
    !username.startsWith("-") &&
    !username.endsWith("-") &&
    !username.includes("--")
  );
};

export const getStats = async (req, res) => {
  const username = String(
    req.query.username || "RisinaLiliia"
  ).trim();

  if (!isValidGitHubUsername(username)) {
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
      repoCount: Number(user.public_repos) || 0,
      followers: Number(user.followers) || 0,
      following: Number(user.following) || 0,

      stars: repos.reduce(
        (sum, repo) =>
          sum + (Number(repo.stargazers_count) || 0),
        0
      ),

      forks: repos.reduce(
        (sum, repo) =>
          sum + (Number(repo.forks_count) || 0),
        0
      ),
    };

    const svg = generateStatsSVG(username, stats);

    setCache(cacheKey, svg);

    return sendSvg(res, svg);
  } catch (error) {
    console.error(
      `Failed to generate stats for ${username}:`,
      error?.message || error
    );

    if (error instanceof GitHubRateLimitError) {
      return res
        .status(503)
        .send("GitHub API rate limit reached");
    }

    return res
      .status(500)
      .send("Failed to generate GitHub statistics");
  }
};

const sendSvg = (res, svg) => {
  res.setHeader(
    "Content-Type",
    "image/svg+xml; charset=utf-8"
  );

  res.setHeader(
    "Cache-Control",
    "public, max-age=0, must-revalidate"
  );

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.send(svg);
};
