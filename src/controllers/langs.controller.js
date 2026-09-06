import {
  getRepos,
  getRepoLanguages,
  GitHubRateLimitError,
} from "../services/github.service.js";

import { getCache, setCache } from "../utils/cache.js";
import { generateLangsSVG } from "../components/langsSvg.js";

const inFlightRequests = new Map();

export const getTopLangs = async (req, res) => {
  const username = String(req.query.username || "RisinaLiliia").trim();

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return res.status(400).send("Invalid GitHub username");
  }

  const cacheKey = `langs_${username.toLowerCase()}`;

  const cached = getCache(cacheKey);

  if (cached) {
    return sendSvg(res, cached);
  }

  try {
  
    if (inFlightRequests.has(cacheKey)) {
      const svg = await inFlightRequests.get(cacheKey);
      return sendSvg(res, svg);
    }

    const requestPromise = buildLanguagesSvg(username, cacheKey);

    inFlightRequests.set(cacheKey, requestPromise);

    const svg = await requestPromise;

    return sendSvg(res, svg);
  } catch (error) {
    console.error("Top languages error:", error);

    if (error instanceof GitHubRateLimitError) {
      return res.status(503).send("GitHub API rate limit reached");
    }

    return res.status(500).send("Failed to generate language statistics");
  } finally {
    inFlightRequests.delete(cacheKey);
  }
};

async function buildLanguagesSvg(username, cacheKey) {
  const repos = await getRepos(username);

  const stats = {};

  for (const repo of repos) {
    let languages;

    try {
      languages = await getRepoLanguages(username, repo.name);
    } catch (error) {
     
      if (error instanceof GitHubRateLimitError) {
        throw error;
      }

      console.error(
        `Failed to load languages for ${username}/${repo.name}:`,
        error
      );

      continue;
    }

    for (const [lang, bytes] of Object.entries(languages)) {
      stats[lang] = (stats[lang] || 0) + bytes;
    }
  }

  const sorted = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  console.log("Sorted languages for SVG:", sorted);

  const svg = generateLangsSVG(sorted);

  setCache(cacheKey, svg);

  return svg;
}

const sendSvg = (res, svg) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send(svg);
};
