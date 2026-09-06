import {
  getRepos,
  getRepoLanguages,
  GitHubRateLimitError,
} from "../services/github.service.js";

import { getCache, setCache } from "../utils/cache.js";
import { generateLangsSVG } from "../components/langsSvg.js";

const inFlightRequests = new Map();

const isValidGitHubUsername = (username) => {
  return (
    /^[a-zA-Z0-9-]{1,39}$/.test(username) &&
    !username.startsWith("-") &&
    !username.endsWith("-") &&
    !username.includes("--")
  );
};

export const getTopLangs = async (req, res) => {
  const username = String(
    req.query.username || "RisinaLiliia"
  ).trim();

  if (!isValidGitHubUsername(username)) {
    return res.status(400).send("Invalid GitHub username");
  }

  const cacheKey = `langs_${username.toLowerCase()}`;

  const cached = getCache(cacheKey);

  if (cached) {
    return sendSvg(res, cached);
  }

  try {
  
    const existingRequest = inFlightRequests.get(cacheKey);

    if (existingRequest) {
      const svg = await existingRequest;
      return sendSvg(res, svg);
    }

    const requestPromise = buildLanguagesSvg(
      username,
      cacheKey
    );

    inFlightRequests.set(cacheKey, requestPromise);

    try {
      const svg = await requestPromise;
      return sendSvg(res, svg);
    } finally {
      if (inFlightRequests.get(cacheKey) === requestPromise) {
        inFlightRequests.delete(cacheKey);
      }
    }
  } catch (error) {
    console.error(
      `Top languages error for ${username}:`,
      error?.message || error
    );

    if (error instanceof GitHubRateLimitError) {
      return res
        .status(503)
        .send("GitHub API rate limit reached");
    }

    return res
      .status(500)
      .send("Failed to generate language statistics");
  }
};

async function buildLanguagesSvg(username, cacheKey) {
  const repos = await getRepos(username);

  const stats = {};

  for (const repo of repos) {
    try {
      const languages = await getRepoLanguages(
        username,
        repo.name
      );

      for (const [lang, bytes] of Object.entries(languages)) {
        const value = Number(bytes);

        if (!Number.isFinite(value) || value < 0) {
          continue;
        }

        stats[lang] = (stats[lang] || 0) + value;
      }
    } catch (error) {
      if (error instanceof GitHubRateLimitError) {
        throw error;
      }

      console.error(
        `Failed to load repository language data:`,
        error?.message || error
      );
    }
  }

  const sorted = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const svg = generateLangsSVG(sorted);

  setCache(cacheKey, svg);

  return svg;
}

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
