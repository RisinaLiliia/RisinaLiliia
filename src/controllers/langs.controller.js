import { getRepos } from "../services/github.service.js";
import { getCache, setCache } from "../utils/cache.js";
import { generateLangsSVG } from "../components/langsSvg.js";

export const getTopLangs = async (req, res) => {
  const username = req.query.username || "RisinaLiliia";
  const cacheKey = `langs_${username}`;

  const cached = getCache(cacheKey);
  if (cached) return sendSvg(res, cached);

  const repos = await getRepos(username);

  const stats = {};
  repos.forEach((r) => {
    if (!r.language) return;
    stats[r.language] = (stats[r.language] || 0) + 1;
  });

  const totalRepos = repos.length;
  const sorted = Object.entries(stats)
    .filter(([lang, count]) => (count / totalRepos) * 100 >= 1)
    .sort((a, b) => b[1] - a[1]);

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
