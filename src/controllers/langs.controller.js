import { getRepos, getRepoLanguages } from "../services/github.service.js";
import { getCache, setCache } from "../utils/cache.js";
import { generateLangsSVG } from "../components/langsSvg.js";

export const getTopLangs = async (req, res) => {
  const username = req.query.username || "RisinaLiliia";
  const cacheKey = `langs_${username}`;

  const cached = getCache(cacheKey);
  if (cached) return sendSvg(res, cached);

  const repos = await getRepos(username);

  const stats = {};
  for (const repo of repos) {
    const languages = await getRepoLanguages(username, repo.name);
    for (const [lang, bytes] of Object.entries(languages)) {
      stats[lang] = (stats[lang] || 0) + bytes;
    }
  }

  const sorted = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  console.log("Sorted languages ​​for SVG:", sorted);

  const svg = generateLangsSVG(sorted);
  setCache(cacheKey, svg);

  sendSvg(res, svg);
};

const sendSvg = (res, svg) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(svg);
};
